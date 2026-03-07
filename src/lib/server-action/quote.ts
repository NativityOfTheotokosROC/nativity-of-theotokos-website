"use server";

import { toZonedTime } from "date-fns-tz";
import { NewQuote } from "../model/new-quote";
import prisma from "../third-party/prisma";
import { getUser, protect } from "./auth";

export async function addNewQuote(payload: NewQuote) {
	const user = await getUser();
	await protect(user);
	const { englishQuote, russianQuote, scheduledDate } = payload;
	const { author, quote, source } = englishQuote;
	const scheduledLocalDate =
		scheduledDate && toZonedTime(scheduledDate, "Africa/Harare");
	await prisma.quote.create({
		data: {
			author,
			quote,
			source: source ?? null,
			authorRu: russianQuote?.author ?? null,
			quoteRu: russianQuote?.quote ?? null,
			sourceRu: russianQuote?.source ?? null,
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
