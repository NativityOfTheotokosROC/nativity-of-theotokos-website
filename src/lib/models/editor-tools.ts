import {
	ModelInteraction,
	InteractiveModel,
	InputModelInteraction,
} from "@mvc-react/mvc";
import { NewLink } from "./insert-link-modal";

export type EditorToolsModelView = {
	currentState: {
		bold: boolean;
		italic: boolean;
		underline: boolean;
		canUndo: boolean;
		canRedo: boolean;
		canLink: boolean;
		quote: boolean;
		heading: boolean;
		bulletList: boolean;
		numberedList: boolean;
		superscript: boolean;
		subscript: boolean;
		link: boolean;
		selection?: string;
	};
};

export type EditorToolsModelInteraction =
	| ModelInteraction<
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
			| "UNSET_LINK"
	  >
	| InputModelInteraction<"SET_LINK", NewLink>;

export type EditorToolsModel = InteractiveModel<
	EditorToolsModelView,
	EditorToolsModelInteraction
>;
