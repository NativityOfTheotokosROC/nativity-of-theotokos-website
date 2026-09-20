import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItem,
	Language,
	RecurringScheduleItem,
	Translation,
} from "../utilities/types";
import { EditScheduleItemPanelModelView } from "./edit-schedule-item-panel";
import { NewScheduleEvent } from "./schedule-event";

export type ViewScheduleSectionModelView = {
	currentScheduleItems: {
		recurringScheduleItems: RecurringScheduleItem<Translation>[];
		instantaneousScheduleItems: InstantaneousScheduleItem<Translation>[];
	};
	language: Language;
	newEvent?: NewScheduleEvent;
	modifyCallbacks: NonNullable<EditScheduleItemPanelModelView["callbacks"]>;
	maxItems?: number;
};

export type ViewScheduleSectionModelInteraction =
	ModelInteraction<"SWITCH_LANGUAGE">;

export type ViewScheduleSectionModel = InteractiveModel<
	ViewScheduleSectionModelView,
	ViewScheduleSectionModelInteraction
>;
