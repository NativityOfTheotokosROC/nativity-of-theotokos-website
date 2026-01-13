import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { DailyQuote, DailyReadings, ScheduleItem } from "../type/miscellaneous";

export interface HomeModelView {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
	scheduleItems: ScheduleItem[];
}

export type HomeModelInteraction = ModelInteraction<"REFRESH">;

export type HomeModel = InteractiveModel<HomeModelView, HomeModelInteraction>;
