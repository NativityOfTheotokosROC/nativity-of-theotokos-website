"use server";

import { PrismaClient } from "@/src/generated/prisma/client";
import {
	getPlaceholder,
	ImagePlaceholder,
	PlaceholderRepository,
} from "@grod56/placeholder";
import { PrismaPg } from "@prisma/adapter-pg";
import { arrayToShuffled } from "array-shuffle";
import { formatInTimeZone } from "date-fns-tz";
import { NewsArticlePreview } from "../model/news-article-preview";
import holytrinityorthodox from "../third-party/holytrinityorthodox";
import mailerLite from "../third-party/mailer-lite";
import {
	DailyQuote,
	DailyReadings,
	GalleryImage,
	ScheduleItem,
} from "../type/miscellaneous";
import {
	getPrismaPlaceholderRepository,
	isRemotePath,
} from "../utility/miscellaneous";
import { getBaseURL } from "./miscellaneous";

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

const prismaAdapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prismaClient = new PrismaClient({
	adapter: prismaAdapter,
});

export async function getHomeSnapshot(
	scheduleItemCount: number = 4,
	otherArticleCount: number = 4,
	dailyGalleryImagesCount: number = 5,
): Promise<HomeSnapshot> {
	const currentDate = new Date();
	const scheduleItems = await getScheduleItems(
		scheduleItemCount,
		currentDate,
	);
	const newsArticles = await getLatestNews(otherArticleCount);
	const dailyReadings = await getDailyReadings(currentDate);
	const dailyQuote = await getDailyQuote(currentDate);
	const dailyGalleryImages = await getDailyGalleryImages(
		dailyGalleryImagesCount,
		currentDate,
	);
	const modifiedDailyReadings = await getPlaceholder(
		dailyReadings.iconOfTheDay.source,
	).then(placeholder => ({
		...dailyReadings,
		iconOfTheDay: { ...dailyReadings.iconOfTheDay, placeholder },
	}));

	return {
		dailyReadings: modifiedDailyReadings,
		dailyQuote,
		scheduleItems,
		newsArticles,
		dailyGalleryImages,
	};
}

export async function subscribeToMailingList(email: string) {
	mailerLite.subscribers.createOrUpdate({ email });
}

export async function getDailyReadings(currentDate: Date = new Date()) {
	return holytrinityorthodox.getDailyReadings(currentDate);
}

export async function getDailyQuote(currentDate: Date = new Date()) {
	const localDate = new Date(
		formatInTimeZone(currentDate, "CAT", "yyyy-MM-dd"),
	);

	let dailyQuote = await prismaClient.dailyQuote
		.findFirst({
			where: {
				date: localDate,
			},
		})
		.quote();
	if (!dailyQuote) {
		const quotes = await prismaClient.quote.findMany()!;
		dailyQuote = quotes[Math.round(Math.random() * (quotes.length - 1))];
		await prismaClient.dailyQuote.create({
			data: {
				date: localDate,
				quoteId: dailyQuote.id,
			},
		});
	}
	return dailyQuote;
}

export async function getScheduleItems(
	count: number,
	currentDate = new Date(),
) {
	const localDate = new Date(
		formatInTimeZone(currentDate, "CAT", "yyyy-MM-dd"),
	);
	const data = await prismaClient.scheduleItem.findMany({
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
			title: record.title,
			location: record.location,
			times: record.scheduleItemTimes,
		}),
	);
	let nextScheduleItemDate = new Date(localDate);
	while (scheduleItems.length < count) {
		const nextScheduleItem =
			await _getNextDefaultScheduleItem(nextScheduleItemDate);
		const isPresent = await prismaClient.scheduleItem.count({
			where: {
				date: { equals: nextScheduleItem.date },
				AND: { removedScheduleItem: { is: null } },
			},
		});
		if (!isPresent) {
			const { date, location, title, times } = nextScheduleItem;
			await prismaClient.scheduleItem.create({
				data: {
					date,
					location,
					title,
					scheduleItemTimes: { createMany: { data: times } },
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
	const baseURL = await getBaseURL();
	const otherArticles = await prismaClient.newsArticle.findMany({
		where: {
			featuredArticle: {
				is: null,
			},
		},
		orderBy: {
			dateCreated: "desc",
		},
		take: otherArticlesCount,
	});
	const featuredArticle = await prismaClient.featuredArticle.findFirstOrThrow(
		{
			include: { newsArticle: true },
		},
	);
	const allArticles = [featuredArticle.newsArticle, ...otherArticles];
	const unplaceholderedArticles: typeof allArticles = [];

	for (let i = 0; i < allArticles.length; i++) {
		const item = await prismaClient.imagePlaceholder.findFirst({
			where: {
				imageLink: {
					equals: allArticles[i].imageLink,
				},
			},
		});
		if (!item) unplaceholderedArticles.push(allArticles[i]);
	}
	if (unplaceholderedArticles.length) {
		const repository: PlaceholderRepository = {
			findPlaceholder:
				async function (): Promise<ImagePlaceholder | null> {
					return null;
				},
			setPlaceholder: async function (
				src: string,
				placeholder: ImagePlaceholder,
			): Promise<void> {
				const url = new URL(src);
				let processedSrc = url.href;
				if (baseURL.includes(url.hostname)) {
					processedSrc = url.pathname;
				}
				await prismaClient.imagePlaceholder.create({
					data: {
						imageLink: processedSrc,
						placeholder,
					},
				});
			},
		};
		for (let i = 0; i < unplaceholderedArticles.length; i++) {
			const imageLink = unplaceholderedArticles[i].imageLink;
			const imageURL = isRemotePath(imageLink)
				? imageLink
				: `${baseURL}/${imageLink}`;
			await getPlaceholder(imageURL, repository);
		}
	}
	const articlePlaceholders = new Map(
		(
			await prismaClient.imagePlaceholder.findMany({
				where: {
					imageLink: {
						in: allArticles.map(article => article.imageLink),
					},
				},
			})
		).map(placeholder => [placeholder.imageLink, placeholder.placeholder]),
	);
	return {
		featuredArticle: {
			...featuredArticle.newsArticle,
			articleImage: {
				source: featuredArticle.newsArticle.imageLink,
				placeholder: articlePlaceholders.get(
					featuredArticle.newsArticle.imageLink,
				) as ImagePlaceholder,
				about: "Featured article image",
			},
		},
		otherNewsArticles: otherArticles.map(article => ({
			...article,
			articleImage: {
				source: article.imageLink,
				about: "News article image",
				placeholder: articlePlaceholders.get(
					article.imageLink,
				) as ImagePlaceholder,
			},
		})),
	};
}

export async function getDailyGalleryImages(
	count: number,
	currentDate = new Date(),
): Promise<GalleryImage[]> {
	const baseUrl = await getBaseURL();
	const localDate = new Date(
		formatInTimeZone(currentDate, "CAT", "yyyy-MM-dd"),
	);
	let dailyGalleryImages = await prismaClient.dailyGalleryImage
		.findMany({
			select: {
				galleryImage: true,
			},
			where: {
				date: localDate,
			},
		})
		.then(records => records.map(record => record.galleryImage));
	if (
		dailyGalleryImages.length < count &&
		(await prismaClient.galleryImage.count({
			where: {
				dailyGalleryImages: { none: { date: localDate } },
			},
		})) > 0
	) {
		const otherGalleryImages = await prismaClient.galleryImage.findMany({
			where: {
				dailyGalleryImages: {
					none: { date: localDate },
				},
			},
		});
		const shuffledGalleryImages = arrayToShuffled(otherGalleryImages);
		if (otherGalleryImages.length + dailyGalleryImages.length <= count) {
			await prismaClient.dailyGalleryImage.createMany({
				data: shuffledGalleryImages.map(galleryImage => ({
					date: localDate,
					galleryImageId: galleryImage.id,
				})),
			});
			dailyGalleryImages = [
				...dailyGalleryImages,
				...shuffledGalleryImages,
			];
		} else {
			const newDailyGalleryImages = shuffledGalleryImages.slice(
				0,
				count - dailyGalleryImages.length,
			);
			await prismaClient.dailyGalleryImage.createMany({
				data: newDailyGalleryImages.map(galleryImage => ({
					date: localDate,
					galleryImageId: galleryImage.id,
				})),
			});
			dailyGalleryImages = [
				...dailyGalleryImages,
				...newDailyGalleryImages,
			];
		}
	}
	const placeholderedGalleryImages: GalleryImage[] = [];
	const repository = getPrismaPlaceholderRepository(baseUrl, prismaClient);
	// TODO: Optimize
	for (let i = 0; i < dailyGalleryImages.length; i++) {
		placeholderedGalleryImages.push({
			image: {
				source: dailyGalleryImages[i].imageLink,
				about: "Gallery image",
				placeholder: await getPlaceholder(
					dailyGalleryImages[i].imageLink,
					repository,
				),
			},
		});
	}
	return placeholderedGalleryImages;
}

// TODO: To be refactored to something less ... static
async function _getNextDefaultScheduleItem(date: Date): Promise<ScheduleItem> {
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
		if (nextSundayDate.getMonth() != previousSundayDate.getMonth())
			return {
				date: scheduleItemDate,
				location: "Nativity of the Theotokos Parish",
				title: "Divine Liturgy",
				times: [
					{
						time: new Date(
							new Date(scheduleItemDate).setHours(12, 0, 0, 0),
						),
						designation: "Hours",
					},
					{
						time: new Date(
							new Date(scheduleItemDate).setHours(12, 30, 0, 0),
						),
						designation: "Confessions",
					},
					{
						time: new Date(
							new Date(scheduleItemDate).setHours(13, 0, 0, 0),
						),
						designation: "Liturgy",
					},
				],
			};
		return {
			date: nextSundayDate,
			location: "St. Sergius Parish",
			title: "Typika Service",
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
					designation: "Hours",
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
					designation: "Typika",
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
					designation: "Catechism",
				},
			],
		};
	} else {
		const previousSundayDate = new Date(
			new Date(scheduleItemDate).setDate(scheduleItemDate.getDate() - 7),
		);
		if (scheduleItemDate.getMonth() != previousSundayDate.getMonth())
			return {
				date: scheduleItemDate,
				location: "St. Sergius Parish",
				title: "Divine Liturgy",
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
						designation: "Hours",
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
						designation: "Confessions",
					},
					{
						time: new Date(
							new Date(scheduleItemDate.toDateString()).setHours(
								10,
								0,
								0,
								0,
							),
						),
						designation: "Liturgy",
					},
				],
			};
		return await _getNextDefaultScheduleItem(
			new Date(
				new Date(scheduleItemDate).setDate(
					scheduleItemDate.getDate() - 1,
				),
			),
		); // HACK
	}
}
