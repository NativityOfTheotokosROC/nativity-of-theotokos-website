import z, { string } from "zod";
import { Translator } from "../types/general";
import { getEditArticleFormSchema } from "./edit-article-form";
import { emptyStringAsUndefined } from "../utilities/miscellaneous";

export function getPublishArticleFormSchema(t?: Translator) {
	const minSnippet = 100;
	const maxSnippet = 250;
	const maxImageCaption = 150;
	const editArticleFormSchema = getEditArticleFormSchema(t);
	return editArticleFormSchema.extend({
		authorName: z.string().trim().nonempty(),
		snippet: z.preprocess(
			emptyStringAsUndefined,
			string()
				.trim()
				.max(maxSnippet, {
					error:
						t &&
						t("validation.maxCharacters", {
							field: t("reviewArticle.bodyField"),
							max: maxSnippet,
						}),
				})
				.min(minSnippet, {
					error:
						t &&
						t("validation.minCharacters", {
							field: t("reviewArticle.bodyField"),
							min: minSnippet,
						}),
				})
				.optional(),
		),
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
	});
}
