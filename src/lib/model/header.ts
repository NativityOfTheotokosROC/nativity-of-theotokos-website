import { ReadonlyModel } from "@mvc-react/mvc";
import { Navlink } from "../type/general";
import { NavigationUserDetails } from "./user-navigation-widget";

export interface HeaderModelView {
	userDetails: NavigationUserDetails | null;
	navlinks: Navlink[];
}

export type HeaderModel = ReadonlyModel<HeaderModelView>;
