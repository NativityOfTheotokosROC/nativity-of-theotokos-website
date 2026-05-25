import { ReadonlyModel } from "@mvc-react/mvc";
import { Navlink } from "../types/general";

export type HeaderModelView = {
	navlinks: Navlink[];
	hasUserNavigationWidget: boolean;
};

export type HeaderModel = ReadonlyModel<HeaderModelView>;
