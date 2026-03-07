import { ReadonlyModel } from "@mvc-react/mvc";

export interface ForbiddenClientModelView {
	signOutEndpoint: `/${string}`;
}

export type ForbiddenClientModel = ReadonlyModel<ForbiddenClientModelView>;
