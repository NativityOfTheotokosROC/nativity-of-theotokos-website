import { ReadonlyModel } from "@mvc-react/mvc";
import { Navlink } from "../type/miscellaneous";

export interface NavigationMenuModelView {
	navlinks: Navlink[];
	menuType: "vertical" | "horizontal";
}

export type NavigationMenuModel = ReadonlyModel<NavigationMenuModelView>;
