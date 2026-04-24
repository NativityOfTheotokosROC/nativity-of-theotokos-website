"use server";

import { getLocale } from "next-intl/server";
import z from "zod";
import { ArticlePreview } from "../models/article-preview";
import {
	getDailyGalleryImages,
	getDailyQuote,
	getDailyReadings,
	getLatestArticles,
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

export type LatestArticles = {
	featuredArticle: ArticlePreview;
	otherNewsArticles: ArticlePreview[];
};

export type HomeSnapshot = {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
	scheduleItems: ScheduleItem[];
	articles: LatestArticles;
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
		articles,
		dailyQuote,
		dailyGalleryImages,
	] = await Promise.all([
		getDailyReadings(currentDate, locale),
		getScheduleItems(scheduleItemCount, currentDate, locale),
		getLatestArticles(otherArticleCount, locale),
		getDailyQuote(currentDate, locale),
		getDailyGalleryImages(dailyGalleryImagesCount, currentDate),
	]);
	return {
		dailyReadings,
		dailyQuote,
		scheduleItems,
		articles,
		dailyGalleryImages,
	};
}

export async function subscribeToMailingList(email: string) {
	const validatedEmail = z.email().trim().parse(email);
	await mailerLite.subscribers.createOrUpdate({ email: validatedEmail });
}
