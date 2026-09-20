import { ReadonlyModel } from "@mvc-react/mvc";
import { Resource } from "../utilities/types";

export type ResourcesSectionModelView = {
	resources: Resource[];
};

export type ResourcesSectionModel = ReadonlyModel<ResourcesSectionModelView>;
