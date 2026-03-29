import { ReadonlyModel } from "@mvc-react/mvc";
import { Role } from "../type/general";

export interface ProtectedComponentModelView {
	signInEndpoint?: string;
	roles?: Role[];
}

export type ProtectedComponentModel =
	ReadonlyModel<ProtectedComponentModelView>;
