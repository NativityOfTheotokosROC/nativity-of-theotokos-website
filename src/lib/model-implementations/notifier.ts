import { ViewInteractionInterface } from "@mvc-react/stateful";
import {
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { Notification } from "../types/general";
import { createToast } from "../components/miscellaneous/utility";

export type ToastNotification = Notification<"success" | "failure"> & {
	message: string;
};

export function notifierVIInterface<
	N extends Notification<T>,
	T = unknown,
>(): ViewInteractionInterface<
	NotifierModelView<N>,
	NotifierModelInteraction<N>
> {
	return {
		produceModelView: async function (
			interaction: NotifierModelInteraction<N>,
		): Promise<NotifierModelView<N>> {
			switch (interaction.type) {
				case "NOTIFY": {
					return { notification: interaction.input.notification };
				}
			}
		},
	};
}

export function toastNotifierVIInterface<N extends ToastNotification>() {
	return {
		produceModelView: async function (
			interaction: NotifierModelInteraction<N>,
		) {
			switch (interaction.type) {
				case "NOTIFY": {
					const notification = interaction.input.notification;
					if (notification.type == "success") {
						createToast({
							type: "success",
							message: notification.message,
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
		NotifierModelView<N>,
		NotifierModelInteraction<N>
	>;
}
