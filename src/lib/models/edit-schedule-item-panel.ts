import { Model } from "@mvc-react/mvc";
import { ScheduleEvent } from "../utilities/schedule";
import { RecurringScheduleItemInstance } from "../utilities/types";

export type ModifiedScheduleEvent =
	| ScheduleEvent
	| {
			type: "recurringInstance";
			scheduleItem: RecurringScheduleItemInstance;
	  };
export type EditScheduleItemPanelModelView = {
	event: ModifiedScheduleEvent;
	callbacks?: {
		editCallback: (event: ModifiedScheduleEvent) => void;
		toggleCallback: (event: ModifiedScheduleEvent) => void;
		deleteCallback: (event: ScheduleEvent) => void;
	};
};
export type EditScheduleItemPanelModel = Model<EditScheduleItemPanelModelView>;
