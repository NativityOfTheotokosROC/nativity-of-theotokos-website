import { InitializedModel } from "@mvc-react/mvc";
import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
	AutoCompleteInfo,
	WriteQuoteModel,
	WriteQuoteNotification,
} from "../models/write-quote";
import {
	NotifierModel,
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { ToastNotification } from "../models/toast";
import { addNewQuote, updateQuote } from "../server-actions/quote";

function writeQuoteNotifierVIInterface(
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
		NotifierModelView<WriteQuoteNotification>,
		NotifierModelInteraction<WriteQuoteNotification>
	>;
}

export function useNewQuote(
	options?: Partial<{
		autoCompleteInfo: AutoCompleteInfo;
		toastNotifier: NotifierModel<ToastNotification>;
	}>,
) {
	const notifier = useNewStatefulInteractiveModel(
		writeQuoteNotifierVIInterface(options?.toastNotifier),
	);
	const t = useTranslations("newQuote");
	const router = useRouter();

	return {
		modelView: {
			newQuoteNotification: notifier.modelView?.notification ?? null,
			autoCompleteInfo: options?.autoCompleteInfo,
		},
		async interact(interaction) {
			switch (interaction.type) {
				case "ADD_QUOTE": {
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: { type: "pending" },
						},
					});
					const { newQuote, id, options } = interaction.input;
					try {
						if (id === undefined) {
							await addNewQuote(newQuote);
						} else {
							await updateQuote(id, newQuote);
						}
						await Promise.all([
							notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "success",
										message: t("successMessage"),
									},
								},
							}),
							options?.successCallback?.(),
						]);
						router.refresh();
					} catch (error) {
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: `${t("failureMessage")} ${error}`,
								},
							},
						});
					}
				}
			}
		},
	} satisfies InitializedModel<WriteQuoteModel>;
}
