import { ReadonlyModel } from "@mvc-react/mvc";
import { ScheduleItem } from "../types/general";

export type SchedulePreviewWidgetModelView = {
	scheduleItems: ScheduleItem[];
};

export type SchedulePreviewWidgetModel =
	ReadonlyModel<SchedulePreviewWidgetModelView>;
