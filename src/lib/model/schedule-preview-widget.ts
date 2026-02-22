import { ReadonlyModel } from "@mvc-react/mvc";
import { ScheduleItem } from "../type/miscellaneous";

export interface SchedulePreviewWidgetModelView {
	scheduleItems: ScheduleItem[];
}

export type SchedulePreviewWidgetModel =
	ReadonlyModel<SchedulePreviewWidgetModelView>;
