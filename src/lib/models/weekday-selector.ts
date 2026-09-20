import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Day } from "../utilities/weekday-selector";

export type WeekdaySelectorModelView = {
	selectedDays: Set<Day>;
};

export type WeekdaySelectorModelInteraction = InputModelInteraction<
	"TOGGLE_DAY",
	{ day: Day }
>;

export type WeekdaySelectorModel = InteractiveModel<
	WeekdaySelectorModelView,
	WeekdaySelectorModelInteraction
>;
