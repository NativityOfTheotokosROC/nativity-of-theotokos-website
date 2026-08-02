import z from "zod";
import { Translator } from "../types/general";
import { useLocalizedSchema } from "./general";

export function getArticleFormSchema(t?: Translator) {
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
					t("validation.nonEmpty", { field: t("newArticle.title") }),
			})
			.max(maxTitleEn, {
				error:
					t &&
					t("validation.maxCharacters", {
						field: t("newArticle.title"),
						max: maxTitleEn,
					}),
			}),
		body: z
			.string()
			.trim()
			.nonempty({
				error:
					t &&
					t("validation.nonEmpty", { field: t("newArticle.body") }),
			})
			.min(minBodyEn, {
				error:
					t &&
					t("validation.minCharacters", {
						field: t("newArticle.body"),
						min: minBodyEn,
					}),
			}),
	});
	return articleFormSchema;
}

export function useArticleFormSchema() {
	return useLocalizedSchema(getArticleFormSchema);
}
