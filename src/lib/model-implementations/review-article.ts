import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
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
	publishExistingArticle,
	publishNewArticle,
} from "../server-actions/article";
import { Translation } from "../utilities/types";
import { useRouter } from "@/src/i18n/navigation";

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
	draftAssigneeName: Translation,
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
	const router = useRouter();
	return {
		modelView: {
			draftAssigneeName,
			draft,
			currentArticle,
			notification,
		},
		async interact(interaction) {
			switch (interaction.type) {
				case "PUBLISH": {
					await notifier.interact({
						type: "NOTIFY",
						input: { notification: { type: "submitting" } },
					});
					try {
						if (currentArticle) {
							await publishExistingArticle({
								articleId: currentArticle.uri,
								incomingArticle: interaction.input.article,
								ticketId,
								locale,
							});
							await notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "submit_success",
										message: t("submitSuccess"),
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
								},
							},
						});
						router.refresh();
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
