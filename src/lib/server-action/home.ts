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
import { isRemotePath } from "../utility/miscellaneous";
import { getGalleryImages } from "./gallery";
import { getBaseURL } from "./miscellaneous";
import { getPlaceholder } from "./placeholder";

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
	const currentDate = new Date(getDateString(new Date()));
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

export async function getDailyReadings(currentDate: Date, language: Language) {
	"use cache";

	const locale = language;
	return await dailyReadings(currentDate, locale);
}

export async function getDailyQuote(currentDate: Date = new Date()) {
	const locale = await getLocale();
	const localDate = new Date(getDateString(currentDate, true));

	let dailyQuote = await prisma.dailyQuote
		.findFirst({
			where: {
				date: localDate,
			},
		})
		.quote();
	if (!dailyQuote) {
		const quotes = await prisma.quote.findMany()!;
		dailyQuote = quotes[Math.round(Math.random() * (quotes.length - 1))];
		await prisma.dailyQuote.create({
			data: {
				date: localDate,
				quoteId: dailyQuote.id,
			},
		});
	}
	return locale == "ru"
		? {
				...dailyQuote,
				quote: dailyQuote.quoteRu ?? dailyQuote.quote,
				author: dailyQuote.authorRu ?? dailyQuote.author,
				source: dailyQuote.sourceRu ?? dailyQuote.source,
			}
		: dailyQuote;
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
		include: { scheduleItemTimes: { orderBy: { time: "asc" } } },
	});
	const scheduleItems = data.map(
		(record): ScheduleItem => ({
			date: record.date,
			title:
				locale == "ru"
					? (record.titleRu ?? record.title)
					: record.title,
			location:
				locale == "ru"
					? (record.locationRu ?? record.location)
					: record.location,
			times: record.scheduleItemTimes.map(time => ({
				time: time.time,
				designation:
					locale == "ru"
						? (time.designationRu ?? time.designation)
						: time.designation,
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
		const isPresent = await prisma.scheduleItem.findUnique({
			where: {
				date_location: {
					date: nextScheduleItem.date,
					location: nextScheduleItem.location,
				},
			},
		});
		console.log(isPresent);
		if (!isPresent) {
			const { date, location, title, times, titleRu } = nextScheduleItem;

			await prisma.scheduleItem.create({
				data: {
					date,
					location,
					title,
					titleRu,
					scheduleItemTimes: {
						createMany: {
							data: times,
						},
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
	const otherArticles = await prisma.newsArticle.findMany({
		// TODO: Reinstate when we have enough articles
		// where: {
		// 	featuredArticle: {
		// 		is: null,
		// 	},
		// },
		orderBy: {
			dateCreated: "desc",
		},
		take: otherArticlesCount,
	});
	const featuredArticle = await prisma.featuredArticle.findFirstOrThrow({
		include: { newsArticle: true },
	});
	const allArticles = [featuredArticle.newsArticle, ...otherArticles];
	const unplaceholderedArticles: typeof allArticles = [];

	for (let i = 0; i < allArticles.length; i++) {
		const item = await prisma.imagePlaceholder.findFirst({
			where: {
				imageLink: {
					equals: allArticles[i].imageLink,
				},
			},
		});
		if (!item) unplaceholderedArticles.push(allArticles[i]);
	}
	if (unplaceholderedArticles.length) {
		for (let i = 0; i < unplaceholderedArticles.length; i++) {
			const imageLink = unplaceholderedArticles[i].imageLink;
			const imageURL = isRemotePath(imageLink)
				? imageLink
				: `${baseURL}${imageLink}`;
			await getPlaceholder(imageURL);
		}
	}
	const articlePlaceholders = new Map(
		(
			await prisma.imagePlaceholder.findMany({
				where: {
					imageLink: {
						in: allArticles.map(article => article.imageLink),
					},
				},
			})
		).map(placeholder => [placeholder.imageLink, placeholder.placeholder]),
	);
	const article = featuredArticle.newsArticle;
	const title =
		locale == "ru" && article.titleRu ? article.titleRu : article.title;
	const author =
		locale == "ru" && article.authorRu != null
			? article.authorRu
			: article.author;
	const snippet =
		locale == "ru" && article.snippetRu
			? article.snippetRu
			: article.snippet;
	return {
		featuredArticle: {
			...featuredArticle.newsArticle,
			title,
			author,
			snippet,
			uri: featuredArticle.newsArticle.link, // TODO: Alter schema
			articleImage: {
				source: featuredArticle.newsArticle.imageLink,
				about: featuredArticle.newsArticle.imageCaption,
				placeholder: articlePlaceholders.get(
					featuredArticle.newsArticle.imageLink,
				) as ImagePlaceholder,
			},
		},
		otherNewsArticles: otherArticles.map(article => {
			const title =
				locale == "ru" && article.titleRu
					? article.titleRu
					: article.title;
			const author =
				locale == "ru" && article.authorRu != null
					? article.authorRu
					: article.author;
			const body =
				locale == "ru" && article.bodyRu
					? article.bodyRu
					: article.body;
			const snippet =
				locale == "ru" && article.snippetRu
					? article.snippetRu
					: article.snippet;
			return {
				...article,
				title,
				author,
				body,
				snippet,
				uri: article.link,
				articleImage: {
					source: article.imageLink,
					about: article.imageCaption,
					placeholder: articlePlaceholders.get(
						article.imageLink,
					) as ImagePlaceholder,
				},
			};
		}),
	};
}

export async function getDailyGalleryImages(
	count: number,
	currentDate = new Date(),
): Promise<GalleryImage[]> {
	"use cache";

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
		dailyGalleryImage => dailyGalleryImage.imageLink,
	);
	const otherGalleryImages = allGalleryImages.filter(
		galleryImage => !(galleryImage.imageLink in dailyGalleryImageLinks),
	);

	if (dailyGalleryImages.length < count && otherGalleryImages.length > 0) {
		const shuffledGalleryImages = arrayToShuffled(otherGalleryImages);
		if (otherGalleryImages.length + dailyGalleryImages.length <= count) {
			const newDailyGalleryImages =
				await prisma.dailyGalleryImage.createManyAndReturn({
					data: shuffledGalleryImages.map(galleryImage => ({
						date: localDate,
						imageLink: galleryImage.imageLink,
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
							imageLink: galleryImage.imageLink,
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
		const imageLink = dailyGalleryImages[i].imageLink;
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
}

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
