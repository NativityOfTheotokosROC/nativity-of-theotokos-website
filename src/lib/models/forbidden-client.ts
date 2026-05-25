import { ReadonlyModel } from "@mvc-react/mvc";

export type ForbiddenClientModelView = {
	signOutEndpoint: `/${string}`;
};

export type ForbiddenClientModel = ReadonlyModel<ForbiddenClientModelView>;
