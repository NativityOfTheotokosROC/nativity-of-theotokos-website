import { ReadonlyModel } from "@mvc-react/mvc";
import { Navlink, User } from "../type/miscellaneous";

type NavigationDrawerType = "sidebar" | "accordion";

export interface NavigationDrawerModelView {
	isDrawn: boolean;
	type: NavigationDrawerType;
	navlinks: Navlink[];
	user: User;
}

export type NavigationDrawerModel = ReadonlyModel<NavigationDrawerModelView>;
