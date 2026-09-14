import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItem,
	Options,
	RecurringScheduleItem,
	Text,
	Translation,
} from "../utilities/types";
import {
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
} from "../validation/schedule-item";

type BaseScheduleEvent<
	T extends string,
	I extends InstantaneousScheduleItem<U> | RecurringScheduleItem<U>,
	U extends Text = string,
> = { type: T; scheduleItem?: I };

export type ScheduleEvent<T extends Text = string> =
	| BaseScheduleEvent<"specific", InstantaneousScheduleItem<T>, T>
	| BaseScheduleEvent<"recurring", RecurringScheduleItem<T>, T>;

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
	scheduleEvent: ScheduleEvent<Translation>;
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
