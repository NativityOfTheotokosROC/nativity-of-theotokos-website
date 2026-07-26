import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	NewArticleModel,
	NewArticleModelInteraction,
	NewArticleNotification,
} from "../models/new-article";
import {
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { toastNotifierVIInterface } from "./notifier";
import { useTranslations } from "next-intl";
import { submitArticle } from "../server-actions/article";

const TOAST_NOTIFIER_VI_INTERFACE = toastNotifierVIInterface();

export function newArticleNotifierVIInterface() {
	return {
		produceModelView: async function (
			interaction: NotifierModelInteraction<NewArticleNotification>,
		) {
			switch (interaction.type) {
				case "NOTIFY": {
					const notification = interaction.input.notification;
					switch (notification.type) {
						case "pending": {
							return { notification };
						}
						default: {
							return TOAST_NOTIFIER_VI_INTERFACE.produceModelView(
								{ type: "NOTIFY", input: { notification } },
							);
						}
					}
				}
			}
		},
	} satisfies ViewInteractionInterface<
		NotifierModelView<NewArticleNotification>,
		NotifierModelInteraction<NewArticleNotification>
	>;
}

export function useNewArticle(author?: string) {
	const notifier = useNewStatefulInteractiveModel(
		newArticleNotifierVIInterface(),
	);
	const t = useTranslations("newArticle");
	return {
		modelView: {
			newArticleNotification: notifier.modelView?.notification ?? null,
			author,
		},
		interact: async function (
			interaction: NewArticleModelInteraction,
		): Promise<void> {
			switch (interaction.type) {
				case "SUBMIT": {
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: { type: "pending" },
						},
					});
					await submitArticle(interaction.input.newArticle)
						.then(() =>
							Promise.all([
								notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "success",
											message: t("successMessage"),
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
										type: "failure",
										message: `${t("failureMessage")} ${reason} `,
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
