import { ReadonlyModel } from "@mvc-react/mvc";
import { Role } from "../type/general";

export interface ProtectedComponentModelView {
	roles?: Role[];
}

export type ProtectedComponentModel =
	ReadonlyModel<ProtectedComponentModelView>;
