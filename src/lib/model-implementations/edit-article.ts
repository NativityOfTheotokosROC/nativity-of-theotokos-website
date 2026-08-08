import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
	LastSavedDraft,
	EditArticleModel,
	EditArticleModelInteraction,
	EditArticleNotification,
} from "../models/new-article";
import {
	NotifierModel,
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { ToastNotification } from "../models/toast";
import { saveDraft, submitArticle } from "../server-actions/article";

export function editArticleNotifierVIInterface(
	toastNotifier?: NotifierModel<ToastNotification>,
) {
	return {
		produceModelView: async function (
			interaction: NotifierModelInteraction<EditArticleNotification>,
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
		NotifierModelView<EditArticleNotification>,
		NotifierModelInteraction<EditArticleNotification>
	>;
}

export function useEditArticle(
	ticketId: string,
	options?: Partial<{
		lastSavedDraft: LastSavedDraft;
		author: string;
		toastNotifier: NotifierModel<ToastNotification>;
	}>,
) {
	const notifier = useNewStatefulInteractiveModel(
		editArticleNotifierVIInterface(options?.toastNotifier),
	);
	const t = useTranslations("editArticle");
	const [lastSavedDraft, setLastSavedDraft] = useState<
		LastSavedDraft | undefined
	>(options?.lastSavedDraft);
	const locale = useLocale();
	return {
		modelView: {
			ticketId,
			notification: notifier.modelView?.notification ?? null,
			author: options?.author,
			lastSavedDraft,
		},
		interact: async function (
			interaction: EditArticleModelInteraction,
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
										message: `${t("saveDraftFailure", { message: JSON.stringify(reason) })}`,
									},
								},
							}),
						);
					break;
				}
				case "SUBMIT": {
					const draft = interaction.input.draft;
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: { type: "submitting" },
						},
					});
					await submitArticle(draft, locale)
						.then(() => setLastSavedDraft(draft))
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
			}
		},
	} satisfies EditArticleModel;
}
