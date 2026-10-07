import "server-only";

import { ReplacePropertyType, Text, Translation } from "../utilities/types";
import { AutoCompleteInfo, Quote } from "../models/new-quote";
import database from "../third-party/prisma";
import { cacheTag } from "next/cache";

export type DetailedQuote<T extends Text = string> = ReplacePropertyType<
	Quote<T>,
	"author",
	QuoteAuthor<T>
> & {
	id: number;
};

export type QuoteAuthor<T extends Text = string> = { id: number; name: T };

export async function getAutoCompleteInfo() {
	"use cache: remote";
	cacheTag("quotes");

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
	"use cache: remote";
	cacheTag("quotes");

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

	return quoteRecords.map(({ id, author, source, quote }) => ({
		id,
		author: { id: author.id, name: author.name },
		source: source ?? undefined,
		quote,
	})) satisfies DetailedQuote<Translation>[];
}

export async function getQuoteAuthors() {
	"use cache: remote";
	cacheTag("quote_authors");

	const quoteAuthorRecords = await database.quoteAuthor.findMany({
		include: { name: true },
		orderBy: {
			name: {
				english: "asc",
			},
		},
	});
	return quoteAuthorRecords.map(({ id, name }) => ({
		id,
		name,
	})) satisfies QuoteAuthor<Translation>[];
}

export async function getScheduledQuotes(referenceDate: Date) {
	"use cache: remote";
	cacheTag("quotes");

	const scheduledQuotes = await database.dailyQuote.findMany({
		include: {
			quote: {
				include: {
					author: {
						include: { name: true },
					},
					source: true,
					quote: true,
				},
			},
		},
		where: { date: { gte: referenceDate } },
	});
	return scheduledQuotes.map(({ quote: { id, author, source, quote } }) => ({
		id,
		author: { id: author.id, name: author.name },
		source: source ?? undefined,
		quote,
	})) satisfies DetailedQuote<Translation>[];
}
