import { ReadonlyModel } from "@mvc-react/mvc";
import { Navlink } from "../utilities/types";

export type HeaderModelView = {
	navlinks: Navlink[];
};

export type HeaderModel = ReadonlyModel<HeaderModelView>;
