import { ReadonlyModel } from "@mvc-react/mvc";
import { Navlink } from "../type/general";

export interface HeaderModelView {
	navlinks: Navlink[];
	hasUserNavigationWidget: boolean;
}

export type HeaderModel = ReadonlyModel<HeaderModelView>;
