import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";

type NavigationDrawerType = "sidebar" | "accordion";

export interface NavigationDrawerModelView {
	isDrawn: boolean;
	type: NavigationDrawerType;
}

export type NavigationDrawerModelInteraction =
	| ModelInteraction<"TOGGLE_DRAW">
	| InputModelInteraction<"SET_TYPE", { type: NavigationDrawerType }>;

export type NavigationDrawerModel = InteractiveModel<
	NavigationDrawerModelView,
	NavigationDrawerModelInteraction
>;
