import { ReadonlyModel } from "@mvc-react/mvc";
import { Navlink } from "../type/general";

export interface HeaderModelView {
	navlinks: Navlink[];
}

export type HeaderModel = ReadonlyModel<HeaderModelView>;
