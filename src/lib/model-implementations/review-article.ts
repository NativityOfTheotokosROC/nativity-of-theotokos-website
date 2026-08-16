import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	ReviewArticleModelView,
	ReviewArticleModelInteraction,
	ReviewArticleModel,
	ReviewArticleNotification,
} from "../models/review-article";
import {
	NotifierModel,
	NotifierModelView,
	NotifierModelInteraction,
} from "../models/notifier";
import { ToastNotification } from "./notifier";
import { ArticleDraft } from "../models/edit-article";
import { Article, ArticleTicket } from "../types/general";
import { publishArticle } from "../server-actions/article";
import { useLocale, useTranslations } from "next-intl";

export function reviewArticleNotifierVIInterface(
	toastNotifier?: NotifierModel<ToastNotification>,
) {
	return {
		async produceModelView(interaction) {
			switch (interaction.type) {
				case "NOTIFY": {
					const notification = interaction.input.notification;
					if (notification.type === "submitting")
						return { notification };
					await toastNotifier?.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type:
									notification.type === "submit_success"
										? "success"
										: "failure",
								message: notification.message,
							},
						},
					});
					return { notification };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		NotifierModelView<ReviewArticleNotification>,
		NotifierModelInteraction<ReviewArticleNotification>
	>;
}

export function useReviewArticle(
	ticket: ArticleTicket,
	draft: ArticleDraft,
	currentArticle?: Article,
	options?: Partial<{ toastNotifier: NotifierModel<ToastNotification> }>,
) {
	const t = useTranslations("reviewArticle");
	const notifier = useNewStatefulInteractiveModel(
		reviewArticleNotifierVIInterface(options?.toastNotifier),
	);
	const notification = notifier.modelView?.notification ?? null;
	const locale = useLocale();
	return {
		modelView: { ticket, draft, currentArticle, notification },
		async interact(interaction) {
			switch (interaction.type) {
				case "PUBLISH": {
					await notifier.interact({
						type: "NOTIFY",
						input: { notification: { type: "submitting" } },
					});
					const {
						draft: { title, body },
						imageUrl,
						imageCaption,
						authorName,
						snippet,
					} = interaction.input;
					try {
						await publishArticle(
							ticket.ticketId,
							{
								title,
								body,
								authorName,
								articleImage: {
									source: imageUrl,
									about: imageCaption,
								},
								snippet: snippet ?? "",
							},
							locale,
						);
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "submit_success",
									message: t("submitSuccess"),
								},
							},
						});
					} catch (error) {
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "submit_failure",
									message: t("submitFailure", {
										error: JSON.stringify(error),
									}),
								},
							},
						});
					}
				}
			}
		},
	} satisfies ReviewArticleModel;
}
