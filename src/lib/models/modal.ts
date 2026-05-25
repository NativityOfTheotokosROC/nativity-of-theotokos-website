import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export type ModalModelView = {
	isOpen: boolean;
	title: string;
};

export type ModalToggleValue = "open" | "close";

export type ModalModelInteraction = InputModelInteraction<
	"TOGGLE",
	{ value: ModalToggleValue }
>;

export type ModalModel = InteractiveModel<
	ModalModelView,
	ModalModelInteraction
>;
