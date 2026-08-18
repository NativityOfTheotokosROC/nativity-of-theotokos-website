import {
	useNewStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	ConfirmationDialogModelView,
	ConfirmationDialogModelInteraction,
} from "../models/confirmation-dialog";

export function confirmationDialogVIInterface(
	options?: ConfirmationDialogModelView["options"],
) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "OPEN": {
					const { message, proceedCallback, cancelCallback } =
						interaction.input;
					return {
						isOpen: true,
						message,
						proceedCallback,
						cancelCallback,
						options,
					};
				}
				case "PROCEED": {
					if (!currentModelView)
						throw new Error("Model is uninitialized");
					currentModelView.proceedCallback();
					return { ...currentModelView, isOpen: false };
				}
				case "CANCEL": {
					if (!currentModelView)
						throw new Error("Model is uninitialized");
					currentModelView.cancelCallback?.();
					return { ...currentModelView, isOpen: false };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		ConfirmationDialogModelView,
		ConfirmationDialogModelInteraction
	>;
}

export function useConfirmationDialog(
	options?: ConfirmationDialogModelView["options"],
) {
	const model = useNewStatefulInteractiveModel(
		confirmationDialogVIInterface(options),
	);
	return model;
}
