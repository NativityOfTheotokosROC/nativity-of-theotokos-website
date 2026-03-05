"use server";

import { NewQuote } from "../model/new-quote";
import prisma from "../third-party/prisma";

export async function addNewQuote(payload: NewQuote) {
	const { englishQuote, russianQuote, scheduledDate } = payload;
	const { author, quote, source } = englishQuote;
	await prisma.quote.create({
		data: {
			author,
			quote,
			source: source ?? null,
			authorRu: russianQuote?.author ?? null,
			quoteRu: russianQuote?.quote ?? null,
			sourceRu: russianQuote?.source ?? null,
			dailyQuotes: scheduledDate && {
				connectOrCreate: {
					where: {
						date: scheduledDate,
					},
					create: {
						date: scheduledDate,
					},
				},
			},
		},
	});
}
