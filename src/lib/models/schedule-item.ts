import { ReadonlyModel } from "@mvc-react/mvc";
import { ScheduleItem } from "../types/general";

export type ScheduleItemModelView = {
	scheduleItem: ScheduleItem;
	isFeatured: boolean;
};

export type ScheduleItemModel = ReadonlyModel<ScheduleItemModelView>;
