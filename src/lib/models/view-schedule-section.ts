import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import {
	InstantaneousScheduleItemWithOptionalId,
	RecurringScheduleItemWithOptionalId,
} from "../utilities/schedule";
import {
	InstantaneousScheduleItem,
	Language,
	RecurringScheduleItem,
	Translation,
} from "../utilities/types";
import { EditScheduleItemPanelModelView } from "./edit-schedule-item-panel";

export type ViewScheduleSectionModelView = {
	currentScheduleItems: {
		recurringScheduleItems: RecurringScheduleItem<Translation>[];
		instantaneousScheduleItems: InstantaneousScheduleItem<Translation>[];
	};
	language: Language;
	pendingScheduleItem?:
		| RecurringScheduleItemWithOptionalId<Translation>
		| InstantaneousScheduleItemWithOptionalId<Translation>;
	modifyCallbacks: NonNullable<EditScheduleItemPanelModelView["callbacks"]>;
	maxItems?: number;
};

export type ViewScheduleSectionModelInteraction =
	ModelInteraction<"SWITCH_LANGUAGE">;

export type ViewScheduleSectionModel = InteractiveModel<
	ViewScheduleSectionModelView,
	ViewScheduleSectionModelInteraction
>;
