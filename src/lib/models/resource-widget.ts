import { ReadonlyModel } from "@mvc-react/mvc";
import { Resource } from "../types/general";

export type ResourceWidgetModelView = {
	resource: Resource;
};

export type ResourceWidgetModel = ReadonlyModel<ResourceWidgetModelView>;
