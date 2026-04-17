import { ReadonlyModel } from "@mvc-react/mvc";
import { Resource } from "../types/general";

export interface ResourceWidgetModelView {
	resource: Resource;
}

export type ResourceWidgetModel = ReadonlyModel<ResourceWidgetModelView>;
