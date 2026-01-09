import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { DailyQuote, DailyReadings } from "../type/miscellaneous";

export interface HomeModelView {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
}

export type HomeModelInteraction = ModelInteraction<"REFRESH">;

export type HomeModel = InteractiveModel<HomeModelView, HomeModelInteraction>;
