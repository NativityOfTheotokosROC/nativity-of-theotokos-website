"use server";

import { getLocale, getTranslations } from "next-intl/server";
import z from "zod";
import { ArticlePreview } from "../models/article-card";
import {
	getDailyGalleryImages,
	getDailyReadings,
	getLatestArticles,
} from "../server-only/home";
import { getDailyQuote } from "../server-only/quote";
import { getSchedule } from "../server-only/schedule";
import resend from "../third-party/resend";
import {
	InstantaneousScheduleItemWithOptionalId,
	RecurringScheduleItemInstanceWithOptionalId,
} from "../utilities/schedule";
import {
	DailyQuote,
	DailyReadings,
	GalleryImage,
	Language,
} from "../utilities/types";
import { after } from "next/server";
import NewSubscriber from "../components/email-templates/new-subscriber/NewSubscriber";
import { newReadonlyModel } from "@mvc-react/mvc";
import { BASE_URL, SENDER_EMAIL } from "../utilities/server-constants";

export type LatestArticles = {
	featuredArticle: ArticlePreview;
	otherNewsArticles: ArticlePreview[];
};

export type HomeSnapshot = {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
	scheduleItems: (
		| InstantaneousScheduleItemWithOptionalId
		| RecurringScheduleItemInstanceWithOptionalId
	)[];
	articles: LatestArticles;
	dailyGalleryImages: GalleryImage[];
};

export async function getHomeSnapshot(
	referenceDate: string,
	scheduleItemCount: number = 4,
	otherArticleCount: number = 4,
	dailyGalleryImagesCount: number = 5,
	language?: Language,
): Promise<HomeSnapshot> {
	const locale = language ?? (await getLocale());
	const parsedDate = new Date(z.iso.date().parse(referenceDate));
	const [
		dailyReadings,
		scheduleItems,
		articles,
		dailyQuote,
		dailyGalleryImages,
	] = await Promise.all([
		getDailyReadings(parsedDate, locale),
		getSchedule(parsedDate, scheduleItemCount, locale),
		getLatestArticles(otherArticleCount, locale),
		getDailyQuote(parsedDate, locale),
		getDailyGalleryImages(dailyGalleryImagesCount, parsedDate),
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
	const locale = await getLocale();
	const { data: existingData } = await resend.contacts.get({
		email: validatedEmail,
	});
	if (existingData?.unsubscribed === false) {
		const { error: subError } = await resend.contacts.update({
			id: existingData.id,
			properties: {
				preferredLang: locale,
			},
		});
		if (subError) throw new Error(JSON.stringify(subError));
		return;
	}

	const { data, error: subError } = await resend.contacts.create({
		email: validatedEmail,
		unsubscribed: false,
		properties: {
			preferredLang: locale,
		},
	});
	if (subError) throw new Error(JSON.stringify(subError));
	after(async () => {
		const t = await getTranslations({ locale });
		const unsubLink = `${BASE_URL}/emailUnsubscribe?id=${data.id}`;
		const { error: emailError } = await resend.emails.send({
			from: `${t("miscellaneous.churchName")} <${SENDER_EMAIL}>`,
			to: [validatedEmail],
			subject: t("newSubscriber.title"),
			react: NewSubscriber({
				model: newReadonlyModel({
					language: locale,
					unsubLink,
					prefsLink: `${BASE_URL}/emailPrefs?id=${data.id}`,
				}),
			}),
			headers: {
				"List-Unsubscribe": unsubLink,
				"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
			},
		});
		if (emailError) console.error(JSON.stringify(emailError));
	});
}
