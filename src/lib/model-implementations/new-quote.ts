import { InitializedModel } from "@mvc-react/mvc";
import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { useTranslations } from "next-intl";
import {
	NewQuoteModel,
	NewQuoteModelInteraction,
	NewQuoteNotification,
} from "../models/new-quote";
import {
	NotifierModel,
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { addNewQuote } from "../server-actions/quote";
import { AutoCompleteInfo } from "../utilities/quote-form";
import { ToastNotification } from "./notifier";

function newQuoteNotifierVIInterface(
	toastNotifier?: NotifierModel<ToastNotification>,
) {
	return {
		async produceModelView(interaction) {
			switch (interaction.type) {
				case "NOTIFY": {
					const notification = interaction.input.notification;
					if (notification.type === "pending")
						return { notification };
					const type = notification.type;
					await toastNotifier?.interact({
						type: "NOTIFY",
						input: {
							notification: {
								type:
									type === "success" ? "success" : "failure",
								message: notification.message,
							},
						},
					});
					return { notification };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		NotifierModelView<NewQuoteNotification>,
		NotifierModelInteraction<NewQuoteNotification>
	>;
}

export function useNewQuote(
	options?: Partial<{
		autoCompleteInfo: AutoCompleteInfo;
		toastNotifier: NotifierModel<ToastNotification>;
	}>,
) {
	const notifier = useNewStatefulInteractiveModel(
		newQuoteNotifierVIInterface(options?.toastNotifier),
	);
	const t = useTranslations("newQuote");

	return {
		modelView: {
			newQuoteNotification: notifier.modelView?.notification ?? null,
			autoCompleteInfo: options?.autoCompleteInfo,
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
				}
			}
		},
	} satisfies InitializedModel<NewQuoteModel>;
}
