import { ReadonlyModel } from "@mvc-react/mvc";
import { Navlink } from "../type/miscellaneous";

export interface HeaderModelView {
	navlinks: Navlink[];
}

export type HeaderModel = ReadonlyModel<HeaderModelView>;
