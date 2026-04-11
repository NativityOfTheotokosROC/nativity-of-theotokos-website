import { ReadonlyModel } from "@mvc-react/mvc";
import { Path } from "../type/general";

export interface ForbiddenModelView {
	signOutEndpoint: Path;
}

export type ForbiddenModel = ReadonlyModel<ForbiddenModelView>;
