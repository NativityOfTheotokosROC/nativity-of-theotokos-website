import { InitializedModel } from "@mvc-react/mvc";
import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { useTranslations } from "next-intl";
import { createToast } from "../components/miscellaneous/utility";
import {
	NewQuoteModel,
	NewQuoteModelInteraction,
	NewQuoteNotification,
} from "../models/new-quote";
import {
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { addNewQuote } from "../server-actions/quote";

export function useNewQuote() {
	const notifier = useNewStatefulInteractiveModel({
		produceModelView: async function (
			interaction: NotifierModelInteraction<NewQuoteNotification>,
		): Promise<NotifierModelView<NewQuoteNotification>> {
			switch (interaction.type) {
				case "NOTIFY": {
					const notification = interaction.input.notification;
					if (notification.type == "success") {
						createToast({
							type: "success",
							message: notification.text,
						});
					}
					if (notification.type == "failure") {
						createToast({
							type: "failure",
							message: notification.message,
						});
					}
					return { notification };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		NotifierModelView<NewQuoteNotification>,
		NotifierModelInteraction<NewQuoteNotification>
	>);
	const t = useTranslations("newQuote");

	return {
		modelView: {
			newQuoteNotification: notifier.modelView?.notification ?? null,
		},
		interact: async function (interaction: NewQuoteModelInteraction) {
			switch (interaction.type) {
				case "ADD_QUOTE": {
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: { type: "pending" },
						},
					});
					await addNewQuote(interaction.input.newQuote)
						.then(() =>
							Promise.all([
								notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "success",
											text: t("successMessage"),
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
				}
			}
		},
	} satisfies InitializedModel<NewQuoteModel>;
}
