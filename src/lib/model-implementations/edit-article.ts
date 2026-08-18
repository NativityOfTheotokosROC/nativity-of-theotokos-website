import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
	ArticleDraft,
	EditArticleModel,
	EditArticleModelInteraction,
	EditArticleNotification,
} from "../models/edit-article";
import {
	NotifierModel,
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { ToastNotification } from "../models/toast";
import {
	deleteTicket,
	discardDraft,
	saveDraft,
	submitArticle,
} from "../server-actions/article";
import { Article } from "../types/general";

export function editArticleNotifierVIInterface(
	toastNotifier?: NotifierModel<ToastNotification>,
) {
	return {
		async produceModelView(interaction) {
			switch (interaction.type) {
				case "NOTIFY": {
					const notification = interaction.input.notification;
					if (
						notification.type === "submitting" ||
						notification.type === "saving_draft" ||
						notification.type === "discarding_draft"
					)
						return { notification };
					const toastNotificationType = (
						notification.type === "submit_success" ||
						notification.type === "save_draft_success" ||
						notification.type === "discard_draft_success"
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
		lastSavedDraft: ArticleDraft;
		currentArticle: Article;
		author: string;
		canDeleteTicket: boolean;
		toastNotifier: NotifierModel<ToastNotification>;
	}>,
) {
	const notifier = useNewStatefulInteractiveModel(
		editArticleNotifierVIInterface(options?.toastNotifier),
	);
	const t = useTranslations("editArticle");
	const [lastSavedDraft, setLastSavedDraft] = useState<
		ArticleDraft | undefined
	>(options?.lastSavedDraft);
	const locale = useLocale();
	return {
		modelView: {
			ticketId,
			notification: notifier.modelView?.notification ?? null,
			author: options?.author,
			lastSavedDraft,
			currentArticle: options?.currentArticle,
			canDeleteTicket: options?.canDeleteTicket ?? false,
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
					await saveDraft(ticketId, draft, locale)
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
					await submitArticle(ticketId, draft, locale)
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
				case "DISCARD_DRAFT": {
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type: "discarding_draft",
								message: t("discardingDraft"),
							},
						},
					});
					try {
						if (options?.canDeleteTicket) {
							await deleteTicket(ticketId);
						} else {
							await discardDraft(ticketId);
						}
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "discard_draft_success",
									message: t("discardDraftSuccess"),
								},
							},
						});
					} catch (error) {
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "discard_draft_failure",
									message: t("discardDraftFail", {
										message: JSON.stringify(error),
									}),
								},
							},
						});
					}
					break;
				}
				default: {
					interaction satisfies never;
				}
			}
		},
	} satisfies EditArticleModel;
}
