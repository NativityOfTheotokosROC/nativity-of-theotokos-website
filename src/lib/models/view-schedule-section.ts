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
import { ScheduleItemModelView } from "./schedule-item";

export type ViewScheduleSectionModelView = {
	currentScheduleItems: {
		recurringScheduleItems: RecurringScheduleItem<Translation>[];
		instantaneousScheduleItems: InstantaneousScheduleItem<Translation>[];
	};
	language: Language;
	pendingScheduleItem?:
		| RecurringScheduleItemWithOptionalId<Translation>
		| InstantaneousScheduleItemWithOptionalId<Translation>;
	modifyCallbacks: Required<
		NonNullable<ScheduleItemModelView["options"]>
	>["callbacks"];
	maxItems?: number;
};

export type ViewScheduleSectionModelInteraction =
	ModelInteraction<"SWITCH_LANGUAGE">;

export type ViewScheduleSectionModel = InteractiveModel<
	ViewScheduleSectionModelView,
	ViewScheduleSectionModelInteraction
>;
