import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItem,
	RecurringScheduleItem,
	Translation,
} from "../types/general";
import {
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
} from "../validation/schedule-item";

export type SchedulerModelView = {
	scheduleItems: {
		instantaneousScheduleItems: InstantaneousScheduleItem[];
		recurringScheduleItems: RecurringScheduleItem[];
		instantaneousScheduleItemsPage: number;
	};
	autoCompleteInfo?: Partial<{
		titleTranslations: Translation[];
		venueTranslations: Translation[];
		designationTranslations: Translation[];
	}>;
};

export type SchedulerModelInteraction =
	| InputModelInteraction<
			"SCHEDULE_SPECIFIC_EVENT",
			{
				specificEvent: NewInstantaneousScheduleItem;
			}
	  >
	| InputModelInteraction<
			"SCHEDULE_RECURRING_EVENT",
			{
				recurringEvent: NewRecurringScheduleItem;
			}
	  >
	| InputModelInteraction<
			"MODIFY_SPECIFIC_EVENT",
			{
				id: number;
			} & (
				| {
						modifiedEvent: NewInstantaneousScheduleItem;
				  }
				| { isRemoved: boolean }
			)
	  >
	| InputModelInteraction<
			"MODIFY_RECURRING_EVENT",
			{
				id: number;
			} & (
				| {
						modifiedEvent: NewRecurringScheduleItem;
				  }
				| { isDisabled: boolean }
			)
	  >
	| InputModelInteraction<
			"DELETE_SPECIFIC_EVENT",
			{
				id: number;
			}
	  >
	| InputModelInteraction<
			"DELETE_RECURRING_EVENT",
			{
				id: number;
			}
	  >
	| InputModelInteraction<
			"UPDATE_SCHEDULE_ITEMS",
			{
				instantaneousScheduleItemsPage: number;
			}
	  >;

export type SchedulerModel = InteractiveModel<
	SchedulerModelView,
	SchedulerModelInteraction
>;
