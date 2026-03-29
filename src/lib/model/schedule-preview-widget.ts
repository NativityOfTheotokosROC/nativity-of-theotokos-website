import { ReadonlyModel } from "@mvc-react/mvc";
import { ScheduleItem } from "../type/general";

export interface SchedulePreviewWidgetModelView {
	scheduleItems: ScheduleItem[];
}

export type SchedulePreviewWidgetModel =
	ReadonlyModel<SchedulePreviewWidgetModelView>;
