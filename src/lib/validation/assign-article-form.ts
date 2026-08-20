import z from "zod";
import { Translator } from "../types/general";
import { useLocalizedSchema } from "./general";

export function getAssignArticleFormSchema(t?: Translator) {
	return z.object({
		name: z
			.string()
			.trim()
			.nonempty({
				error:
					t &&
					t("validation.nonEmpty", {
						field: t("assignArticle.authorNameField"),
					}),
			}),
		email: z.email({
			error:
				t &&
				t("validation.invalidEmail", {
					field: t("assignArticle.emailField"),
				}),
		}),
	});
}

export function useAssignArticleFormSchema(t?: Translator) {
	return useLocalizedSchema(getAssignArticleFormSchema);
}
