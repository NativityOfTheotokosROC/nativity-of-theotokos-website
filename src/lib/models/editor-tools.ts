import { ModelInteraction, InteractiveModel } from "@mvc-react/mvc";

export type EditorToolsModelView = {
	bold: boolean;
	italic: boolean;
	underline: boolean;
	canUndo: boolean;
	canRedo: boolean;
	quote: boolean;
	heading: boolean;
	bulletList: boolean;
	numberedList: boolean;
	superscript: boolean;
	subscript: boolean;
};

export type EditorToolsModelInteraction = ModelInteraction<
	| "TOGGLE_BOLD"
	| "TOGGLE_ITALIC"
	| "TOGGLE_UNDERLINE"
	| "UNDO"
	| "REDO"
	| "TOGGLE_QUOTE"
	| "TOGGLE_HEADING"
	| "TOGGLE_BULLET_LIST"
	| "TOGGLE_NUMBERED_LIST"
	| "TOGGLE_SUPERSCRIPT"
	| "TOGGLE_SUBSCRIPT"
>;

export type EditorToolsModel = InteractiveModel<
	EditorToolsModelView,
	EditorToolsModelInteraction
>;
