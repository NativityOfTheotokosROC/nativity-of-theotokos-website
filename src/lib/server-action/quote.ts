"use server";

import { toZonedTime } from "date-fns-tz";
import { getTranslations } from "next-intl/server";
import { NewQuote } from "../model/new-quote";
import prisma from "../third-party/prisma";
import { getLocalTimeZone } from "../utility/date-time";
import { getQuoteSchema } from "../validation/quote";
import { protect } from "./auth";

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
			scheduledDate,
		});
	const scheduledLocalDate =
		scheduledDate && toZonedTime(scheduledDate, getLocalTimeZone());
	await prisma.quote.create({
		data: {
			author: authorEn,
			quote: quoteEn,
			source: sourceEn ?? null,
			authorRu: authorRu ?? null,
			quoteRu: quoteRu ?? null,
			sourceRu: sourceRu ?? null,
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
	});
}
