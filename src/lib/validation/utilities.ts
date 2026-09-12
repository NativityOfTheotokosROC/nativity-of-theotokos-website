import { useTranslations } from "next-intl";
import z from "zod";
import { emptyStringAsUndefined } from "../utilities/miscellaneous";
import { Translator } from "../utilities/types";

export type ValidationOption<T> = { value: T; invalidMessage?: string };
export type StringValidationOptions = Partial<{
	trim: boolean;
	nonEmpty: ValidationOption<true>;
	invalidStringMessage: string;
	min: ValidationOption<number>;
	max: ValidationOption<number>;
	pattern: ValidationOption<RegExp>;
}>;
export type NewTranslation = z.infer<ReturnType<typeof getTranslationSchema>>;

export function getTranslationSchema(
	options?: (
		| { fieldName: string; t: Translator }
		| {
				englishValidationOptions?: StringValidationOptions;
		  }
	) & {
		russianValidationOptions?: StringValidationOptions;
	},
) {
	const russianValidationOptions = options?.russianValidationOptions;
	const englishSchema =
		options && "englishValidationOptions" in options
			? getStringSchema(options.englishValidationOptions)
			: getStringSchema({
					trim: true,
					nonEmpty: {
						value: true,
						invalidMessage:
							options && "t" in options && options.fieldName
								? options.t("validation.nonEmpty", {
										field: options.fieldName,
									})
								: undefined,
					},
				});
	return z.object({
		english: englishSchema,
		russian: getOptionalStringSchema(russianValidationOptions),
	});
}

export function getStringSchema(options?: StringValidationOptions) {
	let expression = z.string({ error: options?.invalidStringMessage });
	if (options?.trim) expression = expression.trim();
	if (options?.nonEmpty)
		expression = expression.nonempty({
			error: options.nonEmpty.invalidMessage,
		});
	if (options?.min) {
		const { value, invalidMessage } = options.min;
		expression = expression.min(value, { error: invalidMessage });
	}
	if (options?.max) {
		const { value, invalidMessage } = options.max;
		expression = expression.max(value, { error: invalidMessage });
	}
	if (options?.pattern) {
		const { value, invalidMessage } = options.pattern;
		expression = expression.regex(value, { error: invalidMessage });
	}
	return expression;
}

export function getOptionalStringSchema(
	options?: Omit<StringValidationOptions, "nonEmpty"> | z.ZodStringFormat, // Works ig
) {
	return z.preprocess(
		emptyStringAsUndefined,
		options && "_zod" in options
			? options.optional()
			: getStringSchema(options).optional(),
	);
}

export function useLocalizedSchema<S extends ReturnType<typeof z.object>>(
	schemaFunction: (t: Translator) => S,
) {
	const t = useTranslations();
	return schemaFunction(t);
}
