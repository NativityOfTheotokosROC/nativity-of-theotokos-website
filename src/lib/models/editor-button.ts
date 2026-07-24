import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export type EditorButtonModelView = {
	isToggled?: boolean;
	isDisabled?: boolean;
	title: string;
};

export type EditorButtonModelInteraction = InputModelInteraction<
	"ACTION",
	{ isToggled?: boolean }
>;

export type EditorButtonModel = InteractiveModel<
	EditorButtonModelView,
	EditorButtonModelInteraction
>;
