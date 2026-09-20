import { Model } from "@mvc-react/mvc";
import {
	RecurringScheduleItemInstanceWithOptionalId,
	ScheduleEvent,
	UniversalScheduleEvent,
} from "../utilities/schedule";
import { ScheduleEventWithOptionalId } from "./scheduler";

export type UniversalScheduleEventWithOptionalId =
	| ScheduleEventWithOptionalId<string>
	| {
			type: "recurringInstance";
			scheduleItem: RecurringScheduleItemInstanceWithOptionalId;
	  };
export type EditScheduleItemPanelModelView = {
	event: UniversalScheduleEvent;
	callbacks: {
		editCallback: (event: UniversalScheduleEvent) => void;
		toggleCallback: (event: UniversalScheduleEvent) => void;
		deleteCallback: (event: ScheduleEvent) => void;
	};
};
export type EditScheduleItemPanelModel = Model<EditScheduleItemPanelModelView>;
