import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";

export type DropdownVariant = "accordion" | "selection";

export interface DropdownModelView {
	isDrawn: boolean;
}

export type DropdownModelInteraction = ModelInteraction<
	"OPEN" | "CLOSE" | "TOGGLE"
>;

export type DropdownModel = InteractiveModel<
	DropdownModelView,
	DropdownModelInteraction
>;
