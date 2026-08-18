import z from "zod";
import { Translator } from "../types/general";
import { useLocalizedSchema } from "./general";

export function getWriteArticleFormSchema(t?: Translator) {
	const maxTitleEn = 100;
	// const maxTitleRu = maxTitleEn / 1.2
	const minBodyEn = 100;
	const articleFormSchema = z.object({
		title: z
			.string()
			.trim()
			.nonempty({
				error:
					t &&
					t("validation.nonEmpty", {
						field: t("writeArticle.titleField"),
					}),
			})
			.max(maxTitleEn, {
				error:
					t &&
					t("validation.maxCharacters", {
						field: t("writeArticle.titleField"),
						max: maxTitleEn,
					}),
			}),
		body: z
			.string()
			.trim()
			.nonempty({
				error:
					t &&
					t("validation.nonEmpty", {
						field: t("writeArticle.bodyField"),
					}),
			})
			.min(minBodyEn, {
				error:
					t &&
					t("validation.minCharacters", {
						field: t("writeArticle.bodyField"),
						min: minBodyEn,
					}),
			}),
	});
	return articleFormSchema;
}

export function useWriteArticleFormSchema() {
	return useLocalizedSchema(getWriteArticleFormSchema);
}
