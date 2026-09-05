import z from "zod";
import { useTranslations } from "next-intl";
import { Translator } from "../types/general";
import { emptyStringAsUndefined } from "../utilities/miscellaneous";

export function getTranslationSchema(params?: {
	t: Translator;
	fieldName: string;
}) {
	return z.object({
		english: z
			.string()
			.trim()
			.nonempty({
				error:
					params &&
					params.t("validation.nonEmpty", {
						field: params.fieldName,
					}),
			}),
		russian: z.preprocess(
			emptyStringAsUndefined,
			z.string().trim().optional(),
		),
	});
}

export function useLocalizedSchema<S extends ReturnType<typeof z.object>>(
	schemaFunction: (t: Translator) => S,
) {
	const t = useTranslations();
	return schemaFunction(t);
}
