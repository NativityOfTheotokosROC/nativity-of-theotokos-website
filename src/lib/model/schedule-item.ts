import { ReadonlyModel } from "@mvc-react/mvc";
import { ScheduleItem } from "../type/miscellaneous";

export interface ScheduleItemModelView {
	scheduleItem: ScheduleItem;
	isFeatured: boolean;
}

export type ScheduleItemModel = ReadonlyModel<ScheduleItemModelView>;
