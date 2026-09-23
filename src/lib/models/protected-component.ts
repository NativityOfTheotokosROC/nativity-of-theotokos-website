import { ReadonlyModel } from "@mvc-react/mvc";
import { Role } from "../utilities/user";

export type ProtectedComponentModelView = {
	roles?: Role[];
};

export type ProtectedComponentModel =
	ReadonlyModel<ProtectedComponentModelView>;
