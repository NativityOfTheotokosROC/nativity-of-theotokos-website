import z from "zod";
import { Translator } from "../types/general";
import { useLocalizedSchema } from "./general";

export function getEditArticleFormSchema(t?: Translator) {
	const maxTitleEn = 65;
	// const maxTitleRu = maxTitleEn / 1.2
	const minBodyEn = 100;
	const articleFormSchema = z.object({
		title: z
			.string()
			.trim()
			.nonempty({
				error:
					t &&
					t("validation.nonEmpty", { field: t("editArticle.title") }),
			})
			.max(maxTitleEn, {
				error:
					t &&
					t("validation.maxCharacters", {
						field: t("editArticle.title"),
						max: maxTitleEn,
					}),
			}),
		body: z
			.string()
			.trim()
			.nonempty({
				error:
					t &&
					t("validation.nonEmpty", { field: t("editArticle.body") }),
			})
			.min(minBodyEn, {
				error:
					t &&
					t("validation.minCharacters", {
						field: t("editArticle.body"),
						min: minBodyEn,
					}),
			}),
	});
	return articleFormSchema;
}

export function useEditArticleFormSchema() {
	return useLocalizedSchema(getEditArticleFormSchema);
}
