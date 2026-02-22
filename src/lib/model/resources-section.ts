import { ReadonlyModel } from "@mvc-react/mvc";
import { Resource } from "../type/miscellaneous";

export interface ResourcesSectionModelView {
	resources: Resource[];
}

export type ResourcesSectionModel = ReadonlyModel<ResourcesSectionModelView>;
