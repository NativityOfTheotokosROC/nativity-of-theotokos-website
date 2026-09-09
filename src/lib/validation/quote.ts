import z from "zod";
import { Translator } from "../types/general";
import { getDateString } from "../utilities/date-time";
import { emptyStringAsUndefined } from "../utilities/miscellaneous";
import { useLocalizedSchema } from "./general";

export type NewQuote = z.infer<ReturnType<typeof getQuoteSchema>>;

export function getQuoteSchema(t?: Translator) {
	const maxQuoteEn = 600;
	const maxQuoteRu = maxQuoteEn;
	const quoteSchema = z.object({
		author: z.object({
			english: z
				.string()
				.trim()
				.nonempty({
					error:
						t &&
						t("validation.nonEmpty", {
							field: t("newQuote.author"),
						}),
				}),
			russian: z.preprocess(
				emptyStringAsUndefined,
				z.string().trim().optional(),
			),
		}),
		quote: z.object({
			english: z
				.string()
				.trim()
				.nonempty({
					error:
						t &&
						t("validation.nonEmpty", {
							field: t("newQuote.quote"),
						}),
				})
				.max(maxQuoteEn, {
					error:
						t &&
						t("validation.maxCharacters", {
							field: t("newQuote.quote"),
							max: maxQuoteEn,
						}),
				}),
			russian: z.preprocess(
				emptyStringAsUndefined,
				z
					.string()
					.trim()
					.max(maxQuoteRu, {
						error:
							t &&
							t("validation.maxCharacters", {
								field: t("newQuote.quote"),
								max: maxQuoteRu,
							}),
					})
					.optional(),
			),
		}),
		source: z.object({
			english: z.preprocess(
				emptyStringAsUndefined,
				z.string().trim().optional(),
			),
			russian: z.preprocess(
				emptyStringAsUndefined,
				z.string().trim().optional(),
			),
		}),
		scheduledDate: z.preprocess(
			emptyStringAsUndefined,
			//TODO: Add date error messages
			z.iso
				.date()
				.refine(
					date =>
						new Date(date).getTime() >=
						new Date(getDateString(new Date())).getTime(),
				)
				.optional(),
		),
	});
	return quoteSchema;
}

export function useQuoteSchema() {
	return useLocalizedSchema(getQuoteSchema);
}
