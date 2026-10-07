"use server";

import { getTranslations } from "next-intl/server";
import { revalidateTag } from "next/cache";
import database from "../third-party/prisma";
import { getMd5Hash } from "../utilities/miscellaneous";
import { getQuoteSchema, NewQuote } from "../validation/quote";
import { protect } from "./auth";
import z from "zod";

export async function addNewQuote(newQuote: NewQuote) {
	await protect({ roles: ["quotes"] });
	const t = await getTranslations();
	const quoteSchema = getQuoteSchema(t);
	const {
		author,
		quote,
		source,
		scheduledDate: scheduledDateString,
	} = quoteSchema.parse(newQuote);
	const scheduledDate = scheduledDateString
		? new Date(scheduledDateString)
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
				dailyQuotes: scheduledDate && {
					connectOrCreate: {
						create: {
							date: scheduledDate,
						},
						where: {
							date: scheduledDate,
						},
					},
				},
			},
		});
		revalidateTag("quotes", "max");
		revalidateTag("daily-quote", "max");
		return result;
	});
}

export async function addDailyQuote(quoteId: number, date: string) {
	await protect({ roles: ["quotes"] });
	const parsedDate = new Date(z.iso.date().parse(date));
	await database.dailyQuote.upsert({
		create: {
			date: parsedDate,
			quoteId,
		},
		update: {
			quoteId,
		},
		where: {
			date: parsedDate,
		},
	});
	revalidateTag("daily-quote", "max");
}

export async function updateQuote(id: number, newQuote: NewQuote) {
	await protect({ roles: ["quotes"] });
	const t = await getTranslations();
	const quoteSchema = getQuoteSchema(t);
	const {
		author,
		quote,
		source,
		scheduledDate: scheduledDateString,
	} = quoteSchema.parse(newQuote);
	const scheduledDate = scheduledDateString
		? new Date(scheduledDateString)
		: undefined;

	const result = await database.$transaction(async transaction => {
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
		const result = await transaction.quote.update({
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
					update: {
						english: quote.english,
						russian: quote.russian,
						englishHash: getMd5Hash(quote.english),
					},
				},
				dailyQuotes: scheduledDate && {
					connectOrCreate: {
						create: {
							date: scheduledDate,
						},
						where: {
							date: scheduledDate,
						},
					},
				},
			},
			where: {
				id,
			},
		});
		revalidateTag("quotes", "max");
		revalidateTag("daily-quote", "max");
		return result;
	});
	return result;
}

export async function deleteQuote(id: number) {
	await protect({ roles: ["quotes"] });
	await database.quote.delete({
		where: {
			id,
		},
	});
	revalidateTag("quotes", "max");
	revalidateTag("daily-quote", "max");
}

export async function deleteScheduledQuote(date: string) {
	await protect({ roles: ["quotes"] });
	const parsedDate = new Date(z.iso.date().parse(date));
	await database.dailyQuote.delete({ where: { date: parsedDate } });
	revalidateTag("quotes", "max");
	revalidateTag("daily-quote", "max");
}

export async function deleteAuthor(id: number) {
	await protect({ roles: ["quotes"] });
	await database.quoteAuthor.delete({ where: { id } });
	revalidateTag("quote_authors", "max");
}
