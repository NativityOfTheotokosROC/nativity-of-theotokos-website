import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";

export type ConfirmationDialogModelView = {
	isOpen: boolean;
	message: string;
	proceedCallback: () => Promise<void>;
	cancelCallback?: () => Promise<void>;
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
				proceedCallback: () => Promise<void>;
				cancelCallback?: () => Promise<void>;
			}
	  >;

export type ConfirmationDialogModel = InteractiveModel<
	ConfirmationDialogModelView,
	ConfirmationDialogModelInteraction
>;
