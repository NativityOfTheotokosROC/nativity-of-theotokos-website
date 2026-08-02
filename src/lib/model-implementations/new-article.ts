import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { useLocale, useTranslations } from "next-intl";
import {
	LastSavedDraft,
	NewArticleModel,
	NewArticleModelInteraction,
	NewArticleModelView,
	NewArticleNotification,
} from "../models/new-article";
import {
	NotifierModel,
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { ToastNotification } from "../models/toast";
import { saveDraft, submitArticle } from "../server-actions/article";
import { useState } from "react";

export function newArticleNotifierVIInterface(
	toastNotifier?: NotifierModel<ToastNotification>,
) {
	return {
		produceModelView: async function (
			interaction: NotifierModelInteraction<NewArticleNotification>,
		) {
			switch (interaction.type) {
				case "NOTIFY": {
					const notification = interaction.input.notification;
					if (
						notification.type === "submitting" ||
						notification.type === "saving_draft"
					)
						return { notification };
					const toastNotificationType = (
						notification.type === "submit_success" ||
						notification.type === "save_draft_success"
							? "success"
							: "failure"
					) satisfies ToastNotification["type"];
					await toastNotifier?.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type: toastNotificationType,
								message: notification.message,
							},
						},
					});
					return { notification };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		NotifierModelView<NewArticleNotification>,
		NotifierModelInteraction<NewArticleNotification>
	>;
}

export function useNewArticle(
	ticketId: string,
	options?: Partial<{
		lastSavedDraft: NewArticleModelView["lastSavedDraft"];
		author: string;
		toastNotifier: NotifierModel<ToastNotification>;
	}>,
) {
	const notifier = useNewStatefulInteractiveModel(
		newArticleNotifierVIInterface(options?.toastNotifier),
	);
	const t = useTranslations("newArticle");
	const [lastSavedDraft, setLastSavedDraft] = useState<
		LastSavedDraft | undefined
	>(undefined);
	const locale = useLocale();
	return {
		modelView: {
			ticketId,
			newArticleNotification: notifier.modelView?.notification ?? null,
			author: options?.author,
			lastSavedDraft,
		},
		interact: async function (
			interaction: NewArticleModelInteraction,
		): Promise<void> {
			switch (interaction.type) {
				case "SAVE_DRAFT": {
					const draft = interaction.input.draft;
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type: "saving_draft",
								message: t("savingDraft"),
							},
						},
					});
					await saveDraft(draft, locale)
						.then(() => setLastSavedDraft(draft))
						.then(() =>
							Promise.all([
								notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "save_draft_success",
											message: t("saveDraftSuccess"),
										},
									},
								}),
								interaction.input.options?.successCallback?.(),
							]),
						)
						.catch(reason =>
							notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "save_draft_failure",
										message: `${t("saveDraftFailure", { message: reason })}`,
									},
								},
							}),
						);
					break;
				}
				case "SUBMIT": {
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: { type: "submitting" },
						},
					});
					await submitArticle(interaction.input.draft, locale)
						.then(() =>
							Promise.all([
								notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "submit_success",
											message: t("submitSuccess"),
										},
									},
								}),
								interaction.input.options?.successCallback?.(),
							]),
						)
						.catch(reason =>
							notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "submit_failure",
										message: `${t("submitFailure", { message: reason })}`,
									},
								},
							}),
						);
					break;
				}
				case "PREVIEW": {
					// TODO:
					break;
				}
			}
		},
	} satisfies NewArticleModel;
}
