import { ReadonlyModel } from "@mvc-react/mvc";
import { Resource } from "../type/miscellaneous";

export interface ResourceWidgetModelView {
	resource: Resource;
}

export type ResourceWidgetModel = ReadonlyModel<ResourceWidgetModelView>;
