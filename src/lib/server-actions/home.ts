"use server";

import { getLocale } from "next-intl/server";
import z from "zod";
import { ArticlePreview } from "../models/article-preview";
import {
	getDailyGalleryImages,
	getDailyQuote,
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
import { getPlaceholder } from "@grod56/placeholder";
import { unstable_cache } from "next/cache";
import { dailyReadings } from "../third-party/holytrinityorthodox";

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

const getDailyReadings = unstable_cache(
	async (currentDate: Date, language: Language) => {
		// "use cache: remote";
		// cacheTag("daily-readings");
		// cacheLife("max");

		const locale = language;
		return await dailyReadings(currentDate, locale).then(async readings => {
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
		});
	},
	undefined,
	{ tags: ["daily-readings"] },
);

export async function subscribeToMailingList(email: string) {
	const validatedEmail = z.email().trim().parse(email);
	await mailerLite.subscribers.createOrUpdate({ email: validatedEmail });
}
