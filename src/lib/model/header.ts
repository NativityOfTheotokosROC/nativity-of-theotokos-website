import { ReadonlyModel } from "@mvc-react/mvc";
import { Navlink } from "../type/miscellaneous";
import { NavigationUserDetails } from "./user-navigation";

export interface HeaderModelView {
	userDetails: NavigationUserDetails | null;
	navlinks: Navlink[];
}

export type HeaderModel = ReadonlyModel<HeaderModelView>;
