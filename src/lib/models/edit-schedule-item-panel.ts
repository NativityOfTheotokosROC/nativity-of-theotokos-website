import { Model } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItemWithOptionalId,
	RecurringScheduleItemInstanceWithOptionalId,
	RecurringScheduleItemWithOptionalId,
	ScheduleEvent,
} from "../utilities/schedule";

export type ScheduleItemType = ScheduleEvent["type"] | "recurringInstance";
export type EditScheduleItemPanelModelView = {
	scheduleItem:
		| InstantaneousScheduleItemWithOptionalId
		| RecurringScheduleItemInstanceWithOptionalId
		| RecurringScheduleItemWithOptionalId;
	callbacks?: {
		editCallback: (id: number, type: ScheduleItemType) => void;
		deleteCallback: (id: number, type: ScheduleItemType) => void;
		toggleCallback: (id: number, type: ScheduleItemType) => void;
	};
};
export type EditScheduleItemPanelModel = Model<EditScheduleItemPanelModelView>;
