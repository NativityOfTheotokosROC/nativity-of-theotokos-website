import z from "zod";
import { Translator } from "../type/general";
import { getDateString } from "../utility/date-time";
import { emptyStringAsUndefined } from "../utility/miscellaneous";
import { useLocalizedSchema } from "./general";

export function getQuoteSchema(t?: Translator) {
	const maxQuoteEn = 600;
	const maxQuoteRu = maxQuoteEn / 1.2;
	const quoteSchema = z.object({
		authorEn: z
			.string()
			.trim()
			.nonempty({
				error:
					t &&
					t("validation.nonEmpty", { field: t("newQuote.author") }),
			}),
		quoteEn: z
			.string()
			.trim()
			.nonempty({
				error:
					t &&
					t("validation.nonEmpty", { field: t("newQuote.quote") }),
			})
			.max(maxQuoteEn, {
				error:
					t &&
					t("validation.maxCharacters", {
						field: t("newQuote.quote"),
						max: maxQuoteEn,
					}),
			}),
		sourceEn: z.preprocess(
			emptyStringAsUndefined,
			z.string().trim().optional(),
		),
		authorRu: z.preprocess(
			emptyStringAsUndefined,
			z.string().trim().optional(),
		),
		quoteRu: z.preprocess(
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
		sourceRu: z.preprocess(
			emptyStringAsUndefined,
			z.string().trim().optional(),
		),
		scheduledDate: z.preprocess(
			emptyStringAsUndefined,
			z.iso
				.date()
				.pipe(z.coerce.date())
				.refine(
					date => date >= new Date(getDateString(new Date(), true)),
				)
				.optional(),
		),
	});
	return quoteSchema;
}

export function useQuoteSchema() {
	return useLocalizedSchema(getQuoteSchema);
}
