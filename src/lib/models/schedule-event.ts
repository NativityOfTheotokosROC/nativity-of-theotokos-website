import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItemWithTranslations,
	Options,
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

type NewScheduleEvent = {
	[T in ScheduleEvent["type"]]: {
		type: T;
		scheduleItem: T extends "specific"
			? NewInstantaneousScheduleItem
			: T extends "recurring"
				? NewRecurringScheduleItem
				: never;
	};
}[ScheduleEvent["type"]];

export type ScheduleEventModelView = {
	scheduleEvent: ScheduleEvent;
	autoCompleteInfo?: Partial<{
		titleTranslations: Translation[];
		venueTranslations: Translation[];
		designationTranslations: Translation[];
	}>;
} & Options<{
	isNewEventValidCallback: (
		newEvent?: NewScheduleEvent,
		existingId?: number,
	) => void;
	previewCallback: (newEvent: NewScheduleEvent, existingId?: number) => void;
}>;

export type ScheduleEventModelInteraction =
	| InputModelInteraction<
			"UPDATE_SCHEDULE_EVENT",
			{
				event: ScheduleEvent;
			}
	  >
	| InputModelInteraction<
			"SCHEDULE_EVENT",
			{
				newEvent: NewScheduleEvent;
				existingId?: number;
			}
	  >;

export type ScheduleEventModel = InteractiveModel<
	ScheduleEventModelView,
	ScheduleEventModelInteraction
>;
