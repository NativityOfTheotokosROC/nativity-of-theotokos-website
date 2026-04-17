import { ReadonlyModel } from "@mvc-react/mvc";
import { Role } from "../types/general";

export interface ProtectedComponentModelView {
	roles?: Role[];
}

export type ProtectedComponentModel =
	ReadonlyModel<ProtectedComponentModelView>;
