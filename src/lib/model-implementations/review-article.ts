import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { toZonedTime } from "date-fns-tz";
import { useLocale, useTranslations } from "next-intl";
import {
	NotifierModel,
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import {
	ReviewArticleModel,
	ReviewArticleModelView,
	ReviewArticleNotification,
} from "../models/review-article";
import { ToastNotification } from "../models/toast";
import { ArticleDraft } from "../models/write-article";
import {
	publishNewArticle,
	updateExistingArticle,
} from "../server-actions/article";
import { NATIVE_TIMEZONE } from "../utilities/date-time";
import { ArticleAuthor, Translation } from "../utilities/types";

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
	draft: ArticleDraft,
	articleAuthor: ArticleAuthor<Translation>,
	ticketId?: string,
	currentArticle?: ReviewArticleModelView["currentArticle"],
	options?: Partial<{ toastNotifier: NotifierModel<ToastNotification> }>,
) {
	if (!ticketId && !currentArticle)
		throw new Error(
			"No article ticket or existing article ID was provided",
		);
	const t = useTranslations("reviewArticle");
	const notifier = useNewStatefulInteractiveModel(
		reviewArticleNotifierVIInterface(options?.toastNotifier),
	);
	const notification = notifier.modelView?.notification ?? null;
	const locale = useLocale();
	return {
		modelView: {
			articleAuthor,
			draft,
			currentArticle,
			notification,
		},
		async interact(interaction) {
			switch (interaction.type) {
				case "PUBLISH": {
					const { article } = interaction.input;
					await notifier.interact({
						type: "NOTIFY",
						input: { notification: { type: "submitting" } },
					});
					const notificationPublishingDate = article.publishingDate
						? new Date(article.publishingDate)
						: currentArticle?.datePublished &&
							  toZonedTime(
									currentArticle.datePublished,
									NATIVE_TIMEZONE,
							  ).getTime() > Date.now()
							? toZonedTime(
									currentArticle.datePublished,
									NATIVE_TIMEZONE,
								)
							: undefined;
					try {
						if (currentArticle) {
							await updateExistingArticle({
								articleId: currentArticle.uri,
								incomingArticle: article,
								ticketId,
								locale,
							});
							await notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "submit_success",
										message: t("submitSuccess"),
										publishingDate:
											notificationPublishingDate,
									},
								},
							});
							break;
						}
						if (!ticketId)
							throw new Error("No article ticket was provided");
						await publishNewArticle({
							ticketId,
							incomingArticle: interaction.input.article,
							locale,
						});
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "submit_success",
									message: t("submitSuccess"),
									publishingDate: notificationPublishingDate,
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
										message: JSON.stringify(error),
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
