import { ReadonlyModel } from "@mvc-react/mvc";
import { Resource } from "../types/general";

export type ResourcesSectionModelView = {
	resources: Resource[];
};

export type ResourcesSectionModel = ReadonlyModel<ResourcesSectionModelView>;
