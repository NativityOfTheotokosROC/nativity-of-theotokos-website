import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { ScheduleEvent } from "../utilities/schedule";
import { MakeOptional, Options, Translation } from "../utilities/types";
import {
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
} from "../validation/schedule-item";
import { ScheduleEventWithOptionalId } from "./scheduler";

export type NewScheduleEvent = {
	[T in ScheduleEvent["type"]]: {
		type: T;
		scheduleItem: T extends "specific"
			? NewInstantaneousScheduleItem
			: T extends "recurring"
				? NewRecurringScheduleItem
				: never;
	};
}[ScheduleEvent["type"]];

export type SpecificScheduleEventWithOptionalId = MakeOptional<
	Extract<ScheduleEventWithOptionalId, Record<"type", "specific">>,
	"scheduleItem"
>;
export type RecurringScheduleEventWithOptionalId = MakeOptional<
	Extract<ScheduleEventWithOptionalId, Record<"type", "recurring">>,
	"scheduleItem"
>;

export type ScheduleEventModelView = {
	scheduleEvent:
		| SpecificScheduleEventWithOptionalId
		| RecurringScheduleEventWithOptionalId;
	autoCompleteInfo?: Partial<{
		titleTranslations: Translation[];
		venueTranslations: Translation[];
		designationTranslations: Translation[];
	}>;
} & Options<{
	isNewEventValidCallback: (newEvent?: NewScheduleEvent) => void;
	previewCallback: () => void;
}>;

export type ScheduleEventModelInteraction = InputModelInteraction<
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
