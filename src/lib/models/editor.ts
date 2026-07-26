import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export type EditorModelView = {
	content: string;
};

export type EditorModelInteraction = InputModelInteraction<
	"UPDATE_EDITOR",
	{ content: string }
>;

export type EditorModel = InteractiveModel<
	EditorModelView,
	EditorModelInteraction
>;
