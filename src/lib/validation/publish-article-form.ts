import z, { string } from "zod";
import { Translator } from "../types/general";
import { getEditArticleFormSchema } from "./edit-article-form";
import { emptyStringAsUndefined } from "../utilities/miscellaneous";
import { useLocalizedSchema } from "./general";

export function getPublishArticleFormSchema(t?: Translator) {
	const minSnippet = 100;
	const maxSnippet = 250;
	const maxImageCaption = 150;
	const editArticleFormSchema = getEditArticleFormSchema(t);
	return editArticleFormSchema.extend({
		authorName: z.string().trim().nonempty(),
		imageUrl: z.httpUrl({
			error:
				t &&
				t("validation.invalidUrl", {
					field: t("reviewArticle.imageField"),
				}),
		}),
		imageCaption: z
			.string()
			.trim()
			.max(maxImageCaption, {
				error:
					t &&
					t("validation.maxCharacters", {
						field: t("reviewArticle.imageCaptionField"),
						max: maxImageCaption,
					}),
			}),
		snippet: z.preprocess(
			emptyStringAsUndefined,
			string()
				.trim()
				.max(maxSnippet, {
					error:
						t &&
						t("validation.maxCharacters", {
							field: t("reviewArticle.snippetField"),
							max: maxSnippet,
						}),
				})
				.min(minSnippet, {
					error:
						t &&
						t("validation.minCharacters", {
							field: t("reviewArticle.snippetField"),
							min: minSnippet,
						}),
				})
				.optional(),
		),
	});
}

export function usePublishArticleFormSchema() {
	return useLocalizedSchema(getPublishArticleFormSchema);
}
