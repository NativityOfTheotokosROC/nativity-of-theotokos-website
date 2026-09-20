import { ReadonlyModel } from "@mvc-react/mvc";
import { Path } from "../utilities/types";

export type ForbiddenModelView = {
	signOutEndpoint: Path;
};

export type ForbiddenModel = ReadonlyModel<ForbiddenModelView>;
