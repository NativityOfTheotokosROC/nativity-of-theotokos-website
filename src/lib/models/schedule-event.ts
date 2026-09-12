import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItemWithTranslations,
	RecurringScheduleItemWithTranslations,
	Translation,
} from "../utilities/types";
import {
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
} from "../validation/schedule-item";

type BaseScheduleEvent<
	T extends string,
	I extends
		| InstantaneousScheduleItemWithTranslations
		| RecurringScheduleItemWithTranslations,
> = { type: T; scheduleItem?: I };

type ScheduleEvent =
	| BaseScheduleEvent<"specific", InstantaneousScheduleItemWithTranslations>
	| BaseScheduleEvent<"recurring", RecurringScheduleItemWithTranslations>;

type NewScheduleItem = {
	[T in ScheduleEvent["type"]]: {
		type: T;
		scheduleItem: T extends "specific"
			? NewInstantaneousScheduleItem
			: T extends "recurring"
				? NewRecurringScheduleItem
				: never;
	};
}[ScheduleEvent["type"]];

type ModifiedScheduleItem = NewScheduleItem & { id: number };

export type ScheduleEventModelView = {
	scheduleEvent: ScheduleEvent;
	autoCompleteInfo?: Partial<{
		titleTranslations: Translation[];
		venueTranslations: Translation[];
		designationTranslations: Translation[];
	}>;
};

export type ScheduleEventModelInteraction =
	| InputModelInteraction<
			"UPDATE_SCHEDULE_EVENT",
			{
				scheduleEvent: ScheduleEvent;
			}
	  >
	| InputModelInteraction<
			"SCHEDULE_NEW_ITEM",
			{
				newScheduleItem: NewScheduleItem;
			}
	  >
	| InputModelInteraction<
			"MODIFY_ITEM",
			{
				modifiedScheduleItem: ModifiedScheduleItem;
			}
	  >;

export type ScheduleEventModel = InteractiveModel<
	ScheduleEventModelView,
	ScheduleEventModelInteraction
>;
