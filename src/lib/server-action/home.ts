"use server";

import { ImagePlaceholder } from "@grod56/placeholder";
import { arrayToShuffled } from "array-shuffle";
import { getLocale, getTranslations } from "next-intl/server";
import z from "zod";
import { NewsArticlePreview } from "../model/news-article-preview";
import { dailyReadings } from "../third-party/holytrinityorthodox";
import mailerLite from "../third-party/mailer-lite";
import prisma from "../third-party/prisma";
import {
	DailyQuote,
	DailyReadings,
	GalleryImage,
	Language,
	ScheduleItem,
} from "../type/general";
import { getDateString } from "../utility/date-time";
import {
	getEnglishTranslationHash,
	isRemotePath,
} from "../utility/miscellaneous";
import { getGalleryImages } from "./gallery";
import { getBaseURL } from "./miscellaneous";
import { getPlaceholder } from "./placeholder";
import { cacheLife, cacheTag, unstable_cache } from "next/cache";

export type LatestNews = {
	featuredArticle: NewsArticlePreview;
	otherNewsArticles: NewsArticlePreview[];
};

export type HomeSnapshot = {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
	scheduleItems: ScheduleItem[];
	newsArticles: LatestNews;
	dailyGalleryImages: GalleryImage[];
};

export async function getHomeSnapshot(
	scheduleItemCount: number = 4,
	otherArticleCount: number = 4,
	dailyGalleryImagesCount: number = 5,
	language?: Language,
): Promise<HomeSnapshot> {
	const locale = language ?? (await getLocale());
	const currentDate = new Date(getDateString(new Date(), true));
	const [
		dailyReadings,
		scheduleItems,
		newsArticles,
		dailyQuote,
		dailyGalleryImages,
	] = await Promise.all([
		getDailyReadings(currentDate, locale).then(async readings => {
			const placeholder = await getPlaceholder(
				readings.iconOfTheDay.source,
			);
			return {
				...readings,
				iconOfTheDay: {
					...readings.iconOfTheDay,
					placeholder,
				},
			};
		}),
		getScheduleItems(scheduleItemCount, currentDate),
		getLatestNews(otherArticleCount),
		getDailyQuote(currentDate),
		getDailyGalleryImages(dailyGalleryImagesCount, currentDate),
	]);
	return {
		dailyReadings,
		dailyQuote,
		scheduleItems,
		newsArticles,
		dailyGalleryImages,
	};
}

export async function subscribeToMailingList(payload: string) {
	const email = z.email().trim().parse(payload);
	await mailerLite.subscribers.createOrUpdate({ email });
}

export const getDailyReadings = async (
	currentDate: Date,
	language: Language,
) => {
	"use cache: remote";
	cacheLife("max");
	cacheTag("daily-readings");
	const locale = language;
	return await dailyReadings(currentDate, locale);
};

export async function getDailyQuote(currentDate: Date = new Date()) {
	const locale = await getLocale();
	const localDate = new Date(getDateString(currentDate, true));

	let dailyQuote = await prisma.dailyQuote
		.findFirst({
			where: {
				date: localDate,
			},
		})
		.quote({
			include: {
				author: {
					include: { name: true },
				},
				quote: true,
				source: true,
			},
		});
	if (!dailyQuote) {
		const quotes = await prisma.quote.findMany({
			include: {
				author: {
					include: { name: true },
				},
				quote: true,
				source: true,
			},
		});
		dailyQuote = quotes[Math.round(Math.random() * (quotes.length - 1))];
		await prisma.dailyQuote.create({
			data: {
				date: localDate,
				quoteId: dailyQuote.id,
			},
		});
	}
	return (
		locale == "ru"
			? {
					quote: dailyQuote.quote.russian ?? dailyQuote.quote.english,
					author:
						dailyQuote.author.name.russian ??
						dailyQuote.author.name.english,
					source:
						dailyQuote.source?.russian ??
						dailyQuote.source?.english ??
						null,
				}
			: {
					quote: dailyQuote.quote.english,
					author: dailyQuote.author.name.english,
					source: dailyQuote.source?.english ?? null,
				}
	) satisfies DailyQuote;
}

export async function getScheduleItems(
	count: number,
	currentDate = new Date(),
) {
	const localDate = new Date(getDateString(currentDate, true));
	const locale = await getLocale();
	const data = await prisma.scheduleItem.findMany({
		where: {
			date: { gte: localDate },
			AND: { removedScheduleItem: { is: null } },
		},
		orderBy: {
			date: "asc",
		},
		take: count,
		include: {
			title: true,
			venue: true,
			scheduleItemTimes: {
				include: { designation: true },
				orderBy: { time: "asc" },
			},
		},
	});
	const scheduleItems = data.map(
		(record): ScheduleItem => ({
			date: record.date,
			title:
				locale == "ru"
					? (record.title.russian ?? record.title.english)
					: record.title.english,
			location:
				locale == "ru"
					? (record.venue.russian ?? record.venue.english)
					: record.venue.english,
			times: record.scheduleItemTimes.map(time => ({
				time: time.time,
				designation:
					locale == "ru"
						? (time.designation.russian ?? time.designation.english)
						: time.designation.english,
			})),
		}),
	);
	let nextScheduleItemDate = new Date(localDate);
	while (scheduleItems.length < count) {
		const nextScheduleItem = await _getNextDefaultScheduleItem(
			nextScheduleItemDate,
		).then(scheduleItem => ({
			...scheduleItem,
			times: scheduleItem.times.map(time => ({
				...time,
				time: new Date(
					Date.UTC(
						time.time.getFullYear(),
						time.time.getMonth() + 1,
						time.time.getDate(),
						time.time.getHours() - 2,
						time.time.getMinutes(),
					),
				),
			})),
		}));
		// TODO: Revisit
		const isPresent = await prisma.scheduleItem.findFirst({
			where: {
				date: nextScheduleItem.date,
				venue: {
					englishHash: getEnglishTranslationHash(
						nextScheduleItem.location,
					),
				},
			},
		});
		if (!isPresent) {
			const { date, location, title, times, titleRu } = nextScheduleItem;

			await prisma.scheduleItem.create({
				data: {
					date,
					title: {
						connectOrCreate: {
							create: {
								english: title,
								englishHash: getEnglishTranslationHash(title),
								russian: titleRu,
							},
							where: {
								englishHash: getEnglishTranslationHash(title),
							},
						},
					},
					venue: {
						connectOrCreate: {
							create: {
								english: location,
								englishHash:
									getEnglishTranslationHash(location),
							},
							where: {
								englishHash:
									getEnglishTranslationHash(location),
							},
						},
					},
					scheduleItemTimes: {
						create: times.map(time => ({
							time: time.time,
							designation: {
								connectOrCreate: {
									create: {
										english: time.designation,
										russian: time.designationRu,
										englishHash: getEnglishTranslationHash(
											time.designation,
										),
									},
									where: {
										englishHash: getEnglishTranslationHash(
											time.designation,
										),
									},
								},
							},
						})),
					},
				},
			});
			scheduleItems.push(nextScheduleItem);
		}
		nextScheduleItemDate = new Date(
			new Date(nextScheduleItem.date).setDate(
				nextScheduleItem.date.getDate() + 1,
			),
		);
	}
	return scheduleItems;
}

export async function getLatestNews(
	otherArticlesCount: number,
): Promise<LatestNews> {
	const locale = await getLocale();
	const baseURL = await getBaseURL();
	const articleIncludes = {
		title: true,
		body: true,
		snippet: true,
		author: { include: { name: true } },
		image: { include: { placeholder: true, caption: true } },
	};
	const featuredArticle = await prisma.featuredArticle.findFirstOrThrow({
		include: { article: { include: articleIncludes } },
	});
	const otherArticles = await prisma.article.findMany({
		// TODO: Reinstate when we have enough articles
		// where: {
		// 	featuredArticle: {
		// 		is: null,
		// 	},
		// },
		include: articleIncludes,
		orderBy: {
			dateCreated: "desc",
		},
		take: otherArticlesCount,
	});
	const allArticles = [featuredArticle.article, ...otherArticles];
	const unplaceholderedArticles = allArticles.filter(
		article => article.image.placeholder == null,
	);
	const newPlaceholders = new Map<number, ImagePlaceholder>();

	if (unplaceholderedArticles.length) {
		for (let i = 0; i < unplaceholderedArticles.length; i++) {
			const imageLink = unplaceholderedArticles[i].image.link;
			const imageURL = isRemotePath(imageLink)
				? imageLink
				: `${baseURL}${imageLink}`;
			newPlaceholders.set(
				unplaceholderedArticles[i].id,
				await getPlaceholder(imageURL),
			);
		}
	}

	const article = featuredArticle.article;
	const title =
		locale == "ru" && article.title.russian
			? article.title.russian
			: article.title.english;
	const author =
		locale == "ru" && article.author.name.russian != null
			? article.author.name.russian
			: article.author.name.english;
	const snippet =
		locale == "ru" && article.snippet.russian
			? article.snippet.russian
			: article.snippet.english;
	return {
		featuredArticle: {
			...featuredArticle.article,
			title,
			author,
			snippet,
			uri: featuredArticle.article.link,
			articleImage: {
				source: featuredArticle.article.image.link,
				about:
					locale == "ru"
						? (featuredArticle.article.image.caption.russian ??
							featuredArticle.article.image.caption.english)
						: featuredArticle.article.image.caption.english,
				placeholder:
					(featuredArticle.article.image.placeholder
						?.placeholder as ImagePlaceholder) ??
					newPlaceholders.get(featuredArticle.article.id),
			},
		},
		otherNewsArticles: otherArticles.map(article => {
			const title =
				locale == "ru" && article.title.russian
					? article.title.russian
					: article.title.english;
			const author =
				locale == "ru" && article.author.name.russian != null
					? article.author.name.russian
					: article.author.name.english;
			const snippet =
				locale == "ru" && article.snippet.russian
					? article.snippet.russian
					: article.snippet.english;
			return {
				...article,
				title,
				author,
				snippet,
				uri: article.link,
				articleImage: {
					source: article.image.link,
					about:
						locale == "ru"
							? (article.image.caption.russian ??
								article.image.caption.english)
							: article.image.caption.english,
					placeholder:
						(article.image.placeholder
							?.placeholder as ImagePlaceholder) ??
						newPlaceholders.get(article.id),
				},
			};
		}),
	};
}

// TODO: Optimize asap
export const getDailyGalleryImages = unstable_cache(
	async (
		count: number,
		currentDate = new Date(),
	): Promise<GalleryImage[]> => {
		const baseUrl = await getBaseURL();
		const localDate = new Date(getDateString(currentDate, true));
		const fulfilled = await Promise.all([
			getGalleryImages(),
			prisma.dailyGalleryImage.findMany({
				where: {
					date: localDate,
				},
			}),
		]);
		const allGalleryImages = fulfilled[0];
		let dailyGalleryImages = fulfilled[1];

		const dailyGalleryImageLinks = dailyGalleryImages.map(
			dailyGalleryImage => dailyGalleryImage.link,
		);
		const otherGalleryImages = allGalleryImages.filter(
			galleryImage => !(galleryImage.imageLink in dailyGalleryImageLinks),
		);

		if (
			dailyGalleryImages.length < count &&
			otherGalleryImages.length > 0
		) {
			const shuffledGalleryImages = arrayToShuffled(otherGalleryImages);
			if (
				otherGalleryImages.length + dailyGalleryImages.length <=
				count
			) {
				const newDailyGalleryImages =
					await prisma.dailyGalleryImage.createManyAndReturn({
						data: shuffledGalleryImages.map(galleryImage => ({
							date: localDate,
							link: galleryImage.imageLink,
						})),
					});
				dailyGalleryImages = [
					...dailyGalleryImages,
					...newDailyGalleryImages,
				];
			} else {
				const newDailyGalleryImages =
					await prisma.dailyGalleryImage.createManyAndReturn({
						data: shuffledGalleryImages
							.slice(0, count - dailyGalleryImages.length)
							.map(galleryImage => ({
								date: localDate,
								link: galleryImage.imageLink,
							})),
					});
				dailyGalleryImages = [
					...dailyGalleryImages,
					...newDailyGalleryImages,
				];
			}
		}
		const placeholderedGalleryImages: GalleryImage[] = [];
		// TODO: Optimize
		for (let i = 0; i < dailyGalleryImages.length; i++) {
			const imageLink = dailyGalleryImages[i].link;
			const imageURL = isRemotePath(imageLink)
				? imageLink
				: `${baseUrl}${imageLink}`;
			placeholderedGalleryImages.push({
				image: {
					source: imageLink,
					placeholder: await getPlaceholder(imageURL),
				},
			});
		}
		return placeholderedGalleryImages;
	},
	["daily-gallery-images"],
);

// TODO: To be refactored to something less ... static
async function _getNextDefaultScheduleItem(date: Date): Promise<
	Omit<ScheduleItem, "times"> & {
		times: { time: Date; designation: string; designationRu: string }[];
	} & { titleRu: string }
> {
	let scheduleItem;
	const tEn = await getTranslations({
		locale: "en",
		namespace: "scheduleItem",
	});
	const tRu = await getTranslations({
		locale: "ru",
		namespace: "scheduleItem",
	});
	const scheduleItemDate = new Date(date);
	while (scheduleItemDate.getDay() > 0 && scheduleItemDate.getDay() < 6) {
		scheduleItemDate.setDate(scheduleItemDate.getDate() + 1);
	}
	if (scheduleItemDate.getDay() == 6) {
		const nextSundayDate = new Date(
			new Date(scheduleItemDate).setDate(scheduleItemDate.getDate() + 1),
		);
		const previousSundayDate = new Date(
			new Date(scheduleItemDate).setDate(scheduleItemDate.getDate() - 6),
		);
		if (nextSundayDate.getMonth() != previousSundayDate.getMonth()) {
			scheduleItem = {
				date: scheduleItemDate,
				location: tEn("secondaryLocation"),
				title: tEn("liturgyService"),
				titleRu: tRu("liturgyService"),
				times: [
					{
						time: new Date(
							new Date(scheduleItemDate.toDateString()).setHours(
								9,
								0,
								0,
								0,
							),
						),
						designation: tEn("orthros"),
						designationRu: tRu("orthros"),
					},
					{
						time: new Date(
							new Date(scheduleItemDate.toDateString()).setHours(
								9,
								30,
								0,
								0,
							),
						),
						designation: tEn("confessions"),
						designationRu: tRu("confessions"),
					},
					{
						time: new Date(
							new Date(scheduleItemDate.toDateString()).setHours(
								10,
								30,
								0,
								0,
							),
						),
						designation: tEn("liturgy"),
						designationRu: tRu("liturgy"),
					},
				],
			};
			return scheduleItem;
		}
		scheduleItem = {
			date: nextSundayDate,
			location: tEn("secondaryLocation"),
			title: tEn("typikaService"),
			titleRu: tRu("typikaService"),
			times: [
				{
					time: new Date(
						new Date(nextSundayDate.toDateString()).setHours(
							9,
							0,
							0,
							0,
						), // TODO: Fix these
					),
					designation: tEn("orthros"),
					designationRu: tRu("orthros"),
				},
				{
					time: new Date(
						new Date(nextSundayDate.toDateString()).setHours(
							9,
							30,
							0,
							0,
						),
					),
					designation: tEn("typika"),
					designationRu: tRu("typika"),
				},
				{
					time: new Date(
						new Date(nextSundayDate.toDateString()).setHours(
							10,
							30,
							0,
							0,
						),
					),
					designation: tEn("catechism"),
					designationRu: tRu("catechism"),
				},
			],
		};
	} else {
		const previousSundayDate = new Date(
			new Date(scheduleItemDate).setDate(scheduleItemDate.getDate() - 7),
		);
		if (scheduleItemDate.getMonth() != previousSundayDate.getMonth()) {
			scheduleItem = {
				date: scheduleItemDate,
				location: tEn("mainLocation"),
				title: tEn("liturgyService"),
				titleRu: tRu("liturgyService"),
				times: [
					{
						time: new Date(
							new Date(scheduleItemDate.toDateString()).setHours(
								12,
								0,
								0,
								0,
							),
						),
						designation: tEn("orthros"),
						designationRu: tRu("orthros"),
					},
					{
						time: new Date(
							new Date(scheduleItemDate.toDateString()).setHours(
								12,
								30,
								0,
								0,
							),
						),
						designation: tEn("confessions"),
						designationRu: tRu("confessions"),
					},
					{
						time: new Date(
							new Date(scheduleItemDate.toDateString()).setHours(
								13,
								0,
								0,
								0,
							),
						),
						designation: tEn("liturgy"),
						designationRu: tRu("liturgy"),
					},
				],
			};
			return scheduleItem;
		}
		scheduleItem = await _getNextDefaultScheduleItem(
			new Date(
				new Date(scheduleItemDate).setDate(
					scheduleItemDate.getDate() - 1,
				),
			),
		); // HACK
	}
	return scheduleItem;
}
