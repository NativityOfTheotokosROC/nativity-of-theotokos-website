import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { ScheduleEvent } from "../utilities/schedule";
import {
	InstantaneousScheduleItem,
	MakeOptional,
	RecurringScheduleItem,
	ReplacePropertyType,
	SelectByDiscriminator,
	Text,
	Translation,
} from "../utilities/types";

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

export type SchedulerModelView = {
	scheduleItems: {
		instantaneousScheduleItems: InstantaneousScheduleItem<Translation>[];
		recurringScheduleItems: RecurringScheduleItem<Translation>[];
		// instantaneousScheduleItemsPage: number;
	};
	autoCompleteInfo?: Partial<{
		titleTranslations: Translation[];
		venueTranslations: Translation[];
		designationTranslations: Translation[];
	}>;
	eventToEdit: ScheduleEvent<Translation>;
};

export type SchedulerModelInteraction =
	| InputModelInteraction<
			"SCHEDULE_EVENT",
			{
				newEvent: ScheduleEventWithOptionalId;
			}
	  >
	| InputModelInteraction<
			"UPDATE_EVENT_TO_EDIT",
			{
				event: ScheduleEventWithOptionalId;
			}
	  >;
// | InputModelInteraction<
// 		"UPDATE_SCHEDULE_ITEMS",
// 		{
// 			instantaneousScheduleItemsPage: number;
// 		}
//   >;

export type SchedulerModel = InteractiveModel<
	SchedulerModelView,
	SchedulerModelInteraction
>;
