import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { MenuItems } from "../type/miscellaneous";

export type NavigationDrawerType = "sidebar" | "accordion";

export interface NavigationDrawerModelView {
	isDrawn: boolean;
	navMenuItems: MenuItems;
}

export type NavigationDrawerModelInteraction = ModelInteraction<
	"OPEN" | "CLOSE" | "TOGGLE"
>;

export type NavigationDrawerModel = InteractiveModel<
	NavigationDrawerModelView,
	NavigationDrawerModelInteraction
>;
