import { ReadonlyModel } from "@mvc-react/mvc";
import { Path } from "../types/general";

export type ForbiddenModelView = {
	signOutEndpoint: Path;
};

export type ForbiddenModel = ReadonlyModel<ForbiddenModelView>;
