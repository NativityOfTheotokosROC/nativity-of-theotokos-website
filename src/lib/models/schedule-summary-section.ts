import { Model } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItem,
	RecurringScheduleItem,
} from "../utilities/types";
import { EditScheduleItemPanelModelView } from "./edit-schedule-item-panel";

export type ScheduleSummarySectionModelView = {
	instantaneousScheduleItems: InstantaneousScheduleItem[];
	recurringScheduleItems: RecurringScheduleItem[];
	modifyCallbacks: NonNullable<EditScheduleItemPanelModelView["callbacks"]>;
};

export type ScheduleSummarySectionModel =
	Model<ScheduleSummarySectionModelView>;
