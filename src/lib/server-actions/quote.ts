"use server";

import { toZonedTime } from "date-fns-tz";
import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";
import database from "../third-party/prisma";
import { getLocalTimeZone } from "../utilities/date-time";
import { getMd5Hash } from "../utilities/miscellaneous";
import { getQuoteSchema, NewQuote } from "../validation/quote";
import { protect } from "./auth";
import { Translation } from "../types/general";
import { AutoCompleteInfo } from "../utilities/quote-form";

export async function getAutoCompleteInfo() {
	await protect({ roles: ["quotes"] });
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
								english: record.source?.english,
								russian: record.source?.russian,
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

export async function addNewQuote(newQuote: NewQuote) {
	await protect({ roles: ["quotes"] });
	const t = await getTranslations();
	const quoteSchema = getQuoteSchema(t);
	const { author, quote, source, scheduledDate } =
		quoteSchema.parse(newQuote);
	const scheduledLocalDate = scheduledDate
		? toZonedTime(scheduledDate, getLocalTimeZone())
		: undefined;

	await database.$transaction(async transaction => {
		const [authorTranslation, sourceTranslation] = await Promise.all([
			transaction.translation.upsert({
				select: { id: true },
				create: {
					english: author.english,
					russian: author.russian,
					englishHash: getMd5Hash(author.english),
				},
				update: {
					russian: author.russian,
				},
				where: {
					englishHash: getMd5Hash(author.english),
				},
			}),
			source.english
				? transaction.translation.upsert({
						select: { id: true },
						create: {
							english: source.english,
							russian: source.russian,
							englishHash: getMd5Hash(source.english),
						},
						update: {
							russian: source.russian,
						},
						where: {
							englishHash: getMd5Hash(source.english),
						},
					})
				: undefined,
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
		const result = await transaction.quote.create({
			data: {
				author: {
					connect: {
						id: quoteAuthor.id,
					},
				},
				source: sourceTranslation?.id
					? {
							connect: {
								id: sourceTranslation.id,
							},
						}
					: undefined,
				quote: {
					create: {
						english: quote.english,
						russian: quote.russian,
						englishHash: getMd5Hash(quote.english),
					},
				},
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
		revalidateTag("daily-quote", "max");
		return result;
	});
}
