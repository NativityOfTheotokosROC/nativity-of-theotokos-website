import { ReadonlyModel } from "@mvc-react/mvc";
import { Path } from "../types/general";

export interface ForbiddenModelView {
	signOutEndpoint: Path;
}

export type ForbiddenModel = ReadonlyModel<ForbiddenModelView>;
