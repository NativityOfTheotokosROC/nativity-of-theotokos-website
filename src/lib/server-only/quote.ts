import "server-only";

import { DailyQuote, Language, Translation } from "../utilities/types";
import { AutoCompleteInfo } from "../models/new-quote";
import database from "../third-party/prisma";
import { cacheLife, cacheTag } from "next/cache";
import { pickTranslation } from "../utilities/miscellaneous";
import { DetailedQuote, QuoteAuthor } from "../utilities/quote";

export async function getAutoCompleteInfo() {
	"use cache: remote";
	cacheTag("quotes", "quote_authors");

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

export async function getDailyQuote(currentDate: Date, language: Language) {
	"use cache: remote";
	cacheTag("daily-quote");
	cacheLife("days");

	let dailyQuote = await database.dailyQuote
		.findFirst({
			where: {
				date: currentDate,
			},
		})
		.quote({
			include: {
				author: {
					include: { name: true },
				},
				quote: true,
				source: true,
			},
		});
	if (!dailyQuote) {
		const quotes = await database.quote.findMany({
			include: {
				author: {
					include: { name: true },
				},
				quote: true,
				source: true,
			},
		});
		dailyQuote = quotes[Math.round(Math.random() * (quotes.length - 1))];
		await database.dailyQuote.create({
			data: {
				date: currentDate,
				quoteId: dailyQuote.id,
			},
		});
	}
	return {
		author: pickTranslation(dailyQuote.author.name, language),
		source: dailyQuote.source
			? pickTranslation(dailyQuote.source, language)
			: null,
		quote: pickTranslation(dailyQuote.quote, language),
	} satisfies DailyQuote;
}
