import { ReadonlyModel } from "@mvc-react/mvc";
import { ScheduleItem } from "../utilities/types";

export type SchedulePreviewWidgetModelView = {
	scheduleItems: ScheduleItem[];
};

export type SchedulePreviewWidgetModel =
	ReadonlyModel<SchedulePreviewWidgetModelView>;
