import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { ScheduleEvent, UniversalScheduleEvent } from "../utilities/schedule";
import {
	InstantaneousScheduleItem,
	MakeOptional,
	RecurringScheduleItem,
	ReplacePropertyType,
	SelectByDiscriminator,
	Text,
	Translation,
} from "../utilities/types";
import {
	NewScheduleEvent,
	RecurringScheduleEventWithOptionalId,
	SpecificScheduleEventWithOptionalId,
} from "./schedule-event";

export type ScheduleEventWithOptionalId<T extends Text = Translation> = {
	[U in ScheduleEvent["type"]]: ReplacePropertyType<
		SelectByDiscriminator<ScheduleEvent<T>, "type", U>,
		"scheduleItem",
		MakeOptional<
			SelectByDiscriminator<ScheduleEvent<T>, "type", U>["scheduleItem"],
			"id"
		>
	>;
}[ScheduleEvent["type"]];
type EventToEdit =
	| SpecificScheduleEventWithOptionalId
	| RecurringScheduleEventWithOptionalId;

export type SchedulerModelView = {
	scheduleItems: {
		instantaneous: InstantaneousScheduleItem<Translation>[];
		recurring: RecurringScheduleItem<Translation>[];
	};
	autoCompleteInfo?: Partial<{
		titleTranslations: Translation[];
		venueTranslations: Translation[];
		designationTranslations: Translation[];
	}>;
	eventToEdit: EventToEdit;
};

export type SchedulerModelInteraction =
	| InputModelInteraction<
			"SCHEDULE_EVENT",
			{
				id?: number;
				newEvent: NewScheduleEvent;
			}
	  >
	| InputModelInteraction<
			"UPDATE_EVENT_TO_EDIT",
			{
				event: EventToEdit;
			}
	  >
	| InputModelInteraction<
			"TOGGLE_EVENT",
			{
				event: UniversalScheduleEvent;
			}
	  >
	| InputModelInteraction<"DELETE_EVENT", { event: ScheduleEvent }>;

export type SchedulerModel = InteractiveModel<
	SchedulerModelView,
	SchedulerModelInteraction
>;
