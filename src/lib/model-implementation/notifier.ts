import { ViewInteractionInterface } from "@mvc-react/stateful";
import { NotifierModelInteraction, NotifierModelView } from "../model/notifier";
import { Notification } from "../type/miscellaneous";

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
