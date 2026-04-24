"use server";

import { toZonedTime } from "date-fns-tz";
import { getTranslations } from "next-intl/server";
import { NewQuote } from "../models/new-quote";
import prisma from "../third-party/prisma";
import { getDateString, getLocalTimeZone } from "../utilities/date-time";
import { getQuoteSchema } from "../validation/quote";
import { protect } from "./auth";
import { getMd5Hash } from "../utilities/miscellaneous";
import { revalidateTag } from "next/cache";

export async function addNewQuote(payload: NewQuote) {
	await protect({ roles: ["quotes"] });
	const { englishQuote, russianQuote, scheduledDate } = payload;
	const { author, quote, source } = englishQuote;
	const t = await getTranslations();
	const quoteSchema = getQuoteSchema(t);
	const { authorEn, quoteEn, sourceEn, authorRu, quoteRu, sourceRu } =
		quoteSchema.parse({
			authorEn: author,
			quoteEn: quote,
			sourceEn: source,
			authorRu: russianQuote?.author,
			quoteRu: russianQuote?.quote,
			sourceRu: russianQuote?.source,
			scheduledDate: scheduledDate && getDateString(scheduledDate), //TODO
		});
	const scheduledLocalDate =
		scheduledDate && toZonedTime(scheduledDate, getLocalTimeZone());

	await prisma.$transaction(async transaction => {
		const [authorTranslation, sourceTranslation, quoteTranslation] =
			await Promise.all([
				transaction.translation.upsert({
					select: { id: true },
					create: {
						english: authorEn,
						russian: authorRu,
						englishHash: getMd5Hash(authorEn),
					},
					update: {},
					where: {
						englishHash: getMd5Hash(authorEn),
					},
				}),
				sourceEn &&
					transaction.translation.upsert({
						select: { id: true },
						create: {
							english: sourceEn,
							russian: sourceRu,
							englishHash: getMd5Hash(sourceEn),
						},
						update: {},
						where: {
							englishHash: getMd5Hash(sourceEn),
						},
					}),
				transaction.translation.create({
					select: { id: true },
					data: {
						english: quoteEn,
						russian: quoteRu,
						englishHash: getMd5Hash(quoteEn),
					},
				}),
			]);
		const quoteAuthor = await transaction.quoteAuthor.upsert({
			select: { id: true },
			create: {
				nameTranslationId: authorTranslation.id,
			},
			update: {},
			where: {
				nameTranslationId: authorTranslation.id,
			},
		});
		return await transaction.quote
			.create({
				data: {
					quoteTranslationId: quoteTranslation.id,
					sourceTranslationId: sourceTranslation
						? sourceTranslation.id
						: null,
					authorId: quoteAuthor.id,
					dailyQuotes: scheduledLocalDate && {
						connectOrCreate: {
							where: {
								date: scheduledLocalDate,
							},
							create: {
								date: scheduledLocalDate,
							},
						},
					},
				},
			})
			.then(() => revalidateTag("daily-quote", "max"));
	});
}
