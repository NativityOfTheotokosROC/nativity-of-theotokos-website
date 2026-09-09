import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItem,
	RecurringScheduleItem,
	Translation,
} from "../types/general";
import {
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
} from "../validation/schedule";

type BaseScheduleEvent<
	T extends string,
	I extends InstantaneousScheduleItem | RecurringScheduleItem,
> = { type: T; scheduleItem?: I };

type ScheduleEvent =
	| BaseScheduleEvent<"specific", InstantaneousScheduleItem>
	| BaseScheduleEvent<"recurring", RecurringScheduleItem>;

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
