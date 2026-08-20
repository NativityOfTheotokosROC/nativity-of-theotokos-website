import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	AssignArticleModel,
	AssignArticleModelView,
	AssignArticleNotification,
} from "../models/assign-article";
import {
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { ToastNotifierModel } from "./notifier";
import { ArticleAuthor } from "../types/general";
import { useTranslations } from "next-intl";
import { InitializedModel } from "@mvc-react/mvc";
import { useState } from "react";
import { assignArticle } from "../server-actions/article";

export function assignArticleNotifierVIInterface(
	toastNotifier?: ToastNotifierModel,
) {
	return {
		async produceModelView(interaction) {
			switch (interaction.type) {
				case "NOTIFY": {
					const { notification } = interaction.input;
					if (notification.type === "submitting")
						return { notification };
					await toastNotifier?.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type:
									notification.type === "submit_success"
										? "success"
										: notification.type === "submit_failure"
											? "failure"
											: "info",
								message: notification.message,
							},
						},
					});
					return { notification };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		NotifierModelView<AssignArticleNotification>,
		NotifierModelInteraction<AssignArticleNotification>
	>;
}

export function useAssignArticle(
	options?: Partial<{
		suggestions: Required<ArticleAuthor>[];
		toastNotifier: ToastNotifierModel;
	}>,
) {
	const notifier = useNewStatefulInteractiveModel(
		assignArticleNotifierVIInterface(options?.toastNotifier),
	);
	const t = useTranslations("assignArticle");
	const [suggestions, setSuggestions] = useState(options?.suggestions);

	return {
		modelView: {
			suggestions,
			notification: notifier.modelView?.notification ?? null,
		},
		async interact(interaction) {
			switch (interaction.type) {
				case "ASSIGN_ARTICLE": {
					const { email, name } = interaction.input.author;
					await notifier.interact({
						type: "NOTIFY",
						input: { notification: { type: "submitting" } },
					});
					try {
						await assignArticle(email, { name });
						const newSuggestions =
							suggestions ??
							new Array<NonNullable<typeof suggestions>>();
						// TODO: Replace this functionality with tanstack query
						if (
							!newSuggestions.some(
								suggestion => suggestion.email === email,
							)
						)
							setSuggestions([
								...newSuggestions,
								{ email, name },
							]);
						interaction.input.successCallback?.();
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "submit_success",
									message: t("assignSuccess"),
								},
							},
						});
					} catch (error) {
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "submit_failure",
									message: t("assignFail", {
										message: JSON.stringify(error),
									}),
								},
							},
						});
					}
				}
			}
		},
	} satisfies InitializedModel<AssignArticleModel>;
}
