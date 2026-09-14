import { ReadonlyModel } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItemWithOptionalId,
	RecurringScheduleItemInstanceWithOptionalId,
} from "../utilities/schedule";
import { ScheduleItemModelView } from "./schedule-item";

export type SchedulePreviewWidgetModelView<
	T =
		| InstantaneousScheduleItemWithOptionalId
		| RecurringScheduleItemInstanceWithOptionalId,
> = {
	schedule: T[];
	highlightedScheduleItem?: T;
	maxDisplayedItems?: number;
	displayRemoved?: boolean;
	scheduleItemOptions?: Required<ScheduleItemModelView["options"]>;
};

export type SchedulePreviewWidgetModel =
	ReadonlyModel<SchedulePreviewWidgetModelView>;
