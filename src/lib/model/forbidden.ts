import { ReadonlyModel } from "@mvc-react/mvc";
import { Language, Path } from "../type/general";

export interface ForbiddenModelView {
	language: Language;
	signOutEndpoint: Path;
}

export type ForbiddenModel = ReadonlyModel<ForbiddenModelView>;
