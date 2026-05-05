import { ReadonlyModel } from "@mvc-react/mvc";
import { Role } from "../types/general";

export type ProtectedComponentModelView = {
	roles?: Role[];
};

export type ProtectedComponentModel =
	ReadonlyModel<ProtectedComponentModelView>;
