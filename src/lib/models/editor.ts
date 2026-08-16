import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export type EditorModelView = {
	content: string;
	className?: string;
	isReadonly?: boolean;
};

export type EditorModelInteraction =
	| InputModelInteraction<"UPDATE_EDITOR", { content: string }>
	| InputModelInteraction<"TOGGLE_READONLY", { value: boolean }>;

export type EditorModel = InteractiveModel<
	EditorModelView,
	EditorModelInteraction
>;
