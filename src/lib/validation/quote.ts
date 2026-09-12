import z from "zod";
import { Translator } from "../utilities/types";
import { getDateString } from "../utilities/date-time";
import { emptyStringAsUndefined } from "../utilities/miscellaneous";
import {
	getOptionalStringSchema,
	getTranslationSchema,
	useLocalizedSchema,
} from "./utilities";

export type NewQuote = z.infer<ReturnType<typeof getQuoteSchema>>;

export function getQuoteSchema(t?: Translator) {
	const maxQuoteEn = 600;
	const maxQuoteRu = maxQuoteEn;
	const quoteSchema = z.object({
		author: getTranslationSchema(
			t && { t, fieldName: t("newQuote.author") },
		),
		quote: getTranslationSchema({
			englishValidationOptions: {
				trim: true,
				nonEmpty: {
					value: true,
					invalidMessage:
						t &&
						t("validation.nonEmpty", {
							field: t("newQuote.quote"),
						}),
				},
				max: {
					value: maxQuoteEn,
					invalidMessage:
						t &&
						t("validation.maxCharacters", {
							field: t("newQuote.quote"),
							max: maxQuoteEn,
						}),
				},
			},
			russianValidationOptions: {
				trim: true,
				max: {
					value: maxQuoteRu,
					invalidMessage:
						t &&
						t("validation.maxCharacters", {
							field: t("newQuote.quote"),
							max: maxQuoteRu,
						}),
				},
			},
		}),
		source: getTranslationSchema().extend({
			english: getOptionalStringSchema(),
		}),
		scheduledDate: getOptionalStringSchema(
			z.iso
				.date()
				.refine(
					date =>
						new Date(date).getTime() >=
						new Date(getDateString(new Date())).getTime(),
				),
		),
	});
	return quoteSchema;
}

export function useQuoteSchema() {
	return useLocalizedSchema(getQuoteSchema);
}
