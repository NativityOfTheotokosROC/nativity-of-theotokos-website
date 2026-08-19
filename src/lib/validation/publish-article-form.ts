import z, { string } from "zod";
import { Translator } from "../types/general";
import { getWriteArticleFormSchema } from "./write-article-form";
import { emptyStringAsUndefined } from "../utilities/miscellaneous";
import { useLocalizedSchema } from "./general";

export const MIN_SNIPPET = 100;
export const MAX_SNIPPET = 300;
export const MAX_IMAGE_CAPTION = 200;

export function getPublishArticleFormSchema(t?: Translator) {
	const minSnippet = MIN_SNIPPET;
	const maxSnippet = MAX_SNIPPET;
	const maxImageCaption = MAX_IMAGE_CAPTION;
	const writeArticleFormSchema = getWriteArticleFormSchema(t);
	return writeArticleFormSchema.extend({
		authorName: z.preprocess(
			emptyStringAsUndefined,
			z.string().trim().optional(),
		),
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
