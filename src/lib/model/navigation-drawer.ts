import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { Navlink } from "../type/general";

export type NavigationDrawerType = "sidebar" | "accordion";

export interface NavigationDrawerModelView {
	isDrawn: boolean;
	hasUserNavigationWidget: boolean;
	navlinks: Navlink[];
}

export type NavigationDrawerModelInteraction = ModelInteraction<
	"OPEN" | "CLOSE" | "TOGGLE"
>;

export type NavigationDrawerModel = InteractiveModel<
	NavigationDrawerModelView,
	NavigationDrawerModelInteraction
>;
