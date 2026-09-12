import z from "zod";
import { Translator } from "../utilities/types";
import {
	getOptionalStringSchema,
	getTranslationSchema,
	useLocalizedSchema,
} from "./utilities";

export const MAX_TITLE = 100;
export const MIN_BODY = 100;
export const MIN_SNIPPET = 100;
export const MAX_SNIPPET = 300;
export const MAX_IMAGE_CAPTION = 200;

export type NewArticleAuthor = z.infer<
	ReturnType<typeof getArticleAuthorSchema>
>;
export type NewArticle = z.infer<ReturnType<typeof getArticleSchema>>;
export type NewArticleSubmission = z.infer<
	ReturnType<typeof getArticleSubmissionSchema>
>;

export function getArticleAuthorSchema(t?: Translator) {
	return z.object({
		//TODO: assign to new translation field
		name: getTranslationSchema(
			t && { t, fieldName: t("assignArticle.authorNameField") },
		),
		email: z.email({
			error:
				t &&
				t("validation.invalidEmail", {
					field: t("assignArticle.emailField"),
				}),
		}),
	});
}

export function getArticleSubmissionSchema(t?: Translator) {
	// const maxTitleRu = maxTitleEn / 1.2
	const articleFormSchema = z.object({
		title: getTranslationSchema({
			englishValidationOptions: {
				trim: true,
				nonEmpty: {
					value: true,
					invalidMessage:
						t &&
						t("validation.nonEmpty", {
							field: t("writeArticle.titleField"),
						}),
				},
				max: {
					value: MAX_TITLE,
					invalidMessage:
						t &&
						t("validation.maxCharacters", {
							field: t("writeArticle.titleField"),
							max: MAX_TITLE,
						}),
				},
			},
		}),
		body: getTranslationSchema({
			englishValidationOptions: {
				trim: true,
				nonEmpty: {
					value: true,
					invalidMessage:
						t &&
						t("validation.nonEmpty", {
							field: t("writeArticle.bodyField"),
						}),
				},
				min: {
					value: MIN_BODY,
					invalidMessage:
						t &&
						t("validation.minCharacters", {
							field: t("writeArticle.bodyField"),
							min: MIN_BODY,
						}),
				},
			},
		}),
	});
	return articleFormSchema;
}
export function getArticleSchema(t?: Translator) {
	const minSnippet = MIN_SNIPPET;
	const maxSnippet = MAX_SNIPPET;
	const maxImageCaption = MAX_IMAGE_CAPTION;

	return getArticleSubmissionSchema(t).extend({
		authorName: getTranslationSchema(
			t && { t, fieldName: t("reviewArticle.authorNameField") },
		),
		snippet: getTranslationSchema().extend({
			english: getOptionalStringSchema({
				max: {
					value: maxSnippet,
					invalidMessage:
						t &&
						t("validation.maxCharacters", {
							field: t("reviewArticle.snippetField"),
							max: maxSnippet,
						}),
				},
				min: {
					value: minSnippet,
					invalidMessage:
						t &&
						t("validation.minCharacters", {
							field: t("reviewArticle.snippetField"),
							min: minSnippet,
						}),
				},
			}),
		}),
		image: z.object({
			url: z.httpUrl({
				error:
					t &&
					t("validation.invalidUrl", {
						field: t("reviewArticle.imageField"),
					}),
			}),
			caption: getTranslationSchema({
				englishValidationOptions: {
					trim: true,
					nonEmpty: {
						value: true,
						invalidMessage:
							t &&
							t("validation.nonEmpty", {
								field: t("reviewArticle.imageCaptionField"),
							}),
					},
					max: {
						value: maxImageCaption,
						invalidMessage:
							t &&
							t("validation.maxCharacters", {
								field: t("reviewArticle.imageCaptionField"),
								max: maxImageCaption,
							}),
					},
				},
			}),
		}),
		isArticleFeatured: z.boolean(),
	});
}

export function useArticleAuthorSchema(t?: Translator) {
	return useLocalizedSchema(getArticleAuthorSchema);
}

export function useArticleSubmissionSchema() {
	return useLocalizedSchema(getArticleSubmissionSchema);
}

export function useArticleSchema() {
	return useLocalizedSchema(getArticleSchema);
}
