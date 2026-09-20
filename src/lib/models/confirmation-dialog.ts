import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";

export type ConfirmationDialogModelView = {
	isOpen: boolean;
	message: string;
	proceedCallback: () => void;
	cancelCallback?: () => void;
	options?: Partial<{
		title: string;
		useTitleHeading?: boolean;
		proceedButtonText: string;
		cancelButtonText: string;
	}>;
};

export type ConfirmationDialogModelInteraction =
	| ModelInteraction<"PROCEED" | "CANCEL">
	| InputModelInteraction<
			"OPEN",
			{
				message: string;
				// TODO: Sus ...
				proceedCallback: () => void;
				cancelCallback?: () => void;
			}
	  >;

export type ConfirmationDialogModel = InteractiveModel<
	ConfirmationDialogModelView,
	ConfirmationDialogModelInteraction
>;
