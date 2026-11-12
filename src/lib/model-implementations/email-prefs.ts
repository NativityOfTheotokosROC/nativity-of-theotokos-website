import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { useTranslations } from "next-intl";
import {
	EmailPrefsModelInteraction,
	EmailPrefsModelView,
} from "../models/email-prefs";
import { toggleSubscribe, updatePreferences } from "../server-actions/email";
import { UninitializedModelError } from "../utilities/errors";
import { Translator } from "../utilities/types";
import { ToastNotifierModel } from "./notifier";

export function emailPrefsVIInterface(
	params:
		| {
				notifications?: {
					notifier: ToastNotifierModel;
					t: Translator;
				};
		  }
		| undefined,
) {
	return {
		async produceModelView(interaction, currentModelView) {
			const notifications = params?.notifications;
			switch (interaction.type) {
				case "TOGGLE_SUBSCRIBE": {
					if (!currentModelView) throw new UninitializedModelError();
					const {
						contact: { id },
					} = currentModelView;
					try {
						await toggleSubscribe(id, interaction.input.value);
						notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notifications.t(
										"emailPrefs.savePreferencesSuccess",
									),
								},
							},
						});
						return {
							...currentModelView,
							prefs: {
								...currentModelView.prefs,
								isUnsubscribed: !interaction.input.value,
							},
						};
					} catch (error) {
						notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: notifications.t(
										"emailPrefs.savePreferencesFailure",
										{ message: JSON.stringify(error) },
									),
								},
							},
						});
						throw error;
					}
				}
				case "UPDATE_PREFS": {
					if (!currentModelView) throw new UninitializedModelError();
					const {
						contact: { id },
					} = currentModelView;
					try {
						const { prefs } = interaction.input;
						await updatePreferences({
							id,
							prefs: interaction.input.prefs,
						});
						notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notifications.t(
										"emailPrefs.savePreferencesSuccess",
									),
								},
							},
						});
						return {
							...currentModelView,
							prefs,
						};
					} catch (error) {
						notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: notifications.t(
										"emailPrefs.savePreferencesFailure",
										{ message: JSON.stringify(error) },
									),
								},
							},
						});
						throw error;
					}
				}
			}
		},
	} satisfies ViewInteractionInterface<
		EmailPrefsModelView,
		EmailPrefsModelInteraction
	>;
}

export function useEmailPrefs({
	initialModelView,
	notifier,
}: {
	initialModelView: EmailPrefsModelView;
	notifier?: ToastNotifierModel;
}) {
	const t = useTranslations();
	const model = useInitializedStatefulInteractiveModel(
		emailPrefsVIInterface(
			notifier ? { notifications: { notifier, t } } : undefined,
		),
		initialModelView,
	);
	return model;
}
