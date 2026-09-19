import { ReadonlyModel } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItemWithOptionalId,
	RecurringScheduleItemInstanceWithOptionalId,
} from "../utilities/schedule";
import { Language, Options } from "../utilities/types";
import { EditScheduleItemPanelModelView } from "./edit-schedule-item-panel";

export type ScheduleItemModelView<
	T =
		| InstantaneousScheduleItemWithOptionalId
		| RecurringScheduleItemInstanceWithOptionalId,
> = {
	scheduleItem: T;
	variant: "basic" | "detailed";
	maxDisplayedTimes?: number;
} & Options<{
	language: Language;
	className: string;
	modifyCallbacks: NonNullable<EditScheduleItemPanelModelView["callbacks"]>;
}>;

export type ScheduleItemModel = ReadonlyModel<ScheduleItemModelView>;
