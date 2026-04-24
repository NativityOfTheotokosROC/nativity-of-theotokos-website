import { ReadonlyModel } from "@mvc-react/mvc";
import { ScheduleItem } from "../types/general";

export interface ScheduleItemModelView {
	scheduleItem: ScheduleItem;
	isFeatured: boolean;
}

export type ScheduleItemModel = ReadonlyModel<ScheduleItemModelView>;
