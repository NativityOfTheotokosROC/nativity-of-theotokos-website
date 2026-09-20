import { ReadonlyModel } from "@mvc-react/mvc";
import { Role } from "../utilities/types";

export type ProtectedComponentModelView = {
	roles?: Role[];
};

export type ProtectedComponentModel =
	ReadonlyModel<ProtectedComponentModelView>;
