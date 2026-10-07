import "server-only";

import { Text, Translation } from "../utilities/types";
import { AutoCompleteInfo, Quote } from "../models/new-quote";
import database from "../third-party/prisma";

export type DetailedQuote<T extends Text = string> = Quote<T> & {
	id: number;
	scheduledDates: Date[];
};

export async function getAutoCompleteInfo() {
	const [authors, sources] = await Promise.all([
		database.quoteAuthor
			.findMany({
				include: { name: true },
				orderBy: { name: { english: "asc" } },
			})
			.then(records =>
				records.map(
					record =>
						({
							english: record.name.english,
							russian: record.name.russian,
						}) satisfies Translation,
				),
			),
		database.quote
			.findMany({
				select: { source: true },
				distinct: ["sourceTranslationId"],
			})
			.then(records =>
				records.map(record =>
					record.source
						? ({
								english: record.source.english,
								russian: record.source.russian,
							} satisfies Translation)
						: undefined,
				),
			),
	]);
	return {
		existingAuthors: authors,
		existingSources: sources.filter(source => source !== undefined),
	} satisfies AutoCompleteInfo;
}

export async function getQuotes() {
	const quoteRecords = await database.quote.findMany({
		include: {
			author: {
				include: { name: true },
			},
			quote: true,
			source: true,
			dailyQuotes: true,
		},
	});

	return quoteRecords.map(({ id, author, source, quote, dailyQuotes }) => ({
		id,
		author: author.name,
		source: source ?? undefined,
		quote,
		scheduledDates: dailyQuotes.map(dailyQuote => dailyQuote.date),
	})) satisfies DetailedQuote<Translation>[];
}
