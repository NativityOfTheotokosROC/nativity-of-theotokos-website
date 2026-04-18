"use server";

import { getLocale } from "next-intl/server";
import z from "zod";
import { NewsArticlePreview } from "../models/news-article-preview";
import {
	getDailyGalleryImages,
	getDailyQuote,
	getDailyReadings,
	getLatestNews,
	getScheduleItems,
} from "../server-only/home";
import mailerLite from "../third-party/mailer-lite";
import {
	DailyQuote,
	DailyReadings,
	GalleryImage,
	Language,
	ScheduleItem,
} from "../types/general";
import { getDateString } from "../utilities/date-time";
import { getPlaceholder } from "../server-only/placeholder";

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
		getScheduleItems(scheduleItemCount, currentDate, locale),
		getLatestNews(otherArticleCount, locale),
		getDailyQuote(currentDate, locale),
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

export async function subscribeToMailingList(email: string) {
	const validatedEmail = z.email().trim().parse(email);
	await mailerLite.subscribers.createOrUpdate({ email: validatedEmail });
}
