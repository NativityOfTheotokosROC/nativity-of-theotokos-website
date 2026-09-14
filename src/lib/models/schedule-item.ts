import { ReadonlyModel } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItemWithOptionalId,
	RecurringScheduleItemInstanceWithOptionalId,
} from "../utilities/schedule";
import { Options } from "../utilities/types";

export type ScheduleItemModelView<
	T =
		| InstantaneousScheduleItemWithOptionalId
		| RecurringScheduleItemInstanceWithOptionalId,
> = {
	scheduleItem: T;
	variant: "basic" | "detailed";
	maxDisplayedTimes?: number;
} & Options<{
	className: string;
	callbacks: {
		editCallback: (scheduleItemId: number) => void;
		toggleCallback: (scheduleItemId: number) => void;
		deleteCallback: (scheduleItemId: number) => void;
	};
}>;

export type ScheduleItemModel = ReadonlyModel<ScheduleItemModelView>;
