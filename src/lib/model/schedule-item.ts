import { ReadonlyModel } from "@mvc-react/mvc";
import { ScheduleItem } from "../type/general";

export interface ScheduleItemModelView {
	scheduleItem: ScheduleItem;
	isFeatured: boolean;
}

export type ScheduleItemModel = ReadonlyModel<ScheduleItemModelView>;
