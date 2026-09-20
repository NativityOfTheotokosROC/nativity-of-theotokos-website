import { Model } from "@mvc-react/mvc";
import { Options, RecurringScheduleItem } from "../utilities/types";
import { EditScheduleItemPanelModelView } from "./edit-schedule-item-panel";

export type RecurringScheduleItemModelView = {
	scheduleItem: RecurringScheduleItem;
	maxDisplayedTimes?: number;
} & Options<{
	modifyCallbacks: NonNullable<EditScheduleItemPanelModelView["callbacks"]>;
	className: string;
}>;

export type RecurringScheduleItemModel = Model<RecurringScheduleItemModelView>;
