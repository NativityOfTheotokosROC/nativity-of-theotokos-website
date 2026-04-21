import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import {
	DailyQuote,
	DailyReadings,
	GalleryImage,
	ScheduleItem,
} from "../types/general";
import { LatestArticles } from "../server-actions/home";

export interface HomeModelView {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
	scheduleItems: ScheduleItem[];
	articles: LatestArticles;
	dailyGalleryImages: GalleryImage[];
}

export type HomeModelInteraction = ModelInteraction<"REFRESH">;

export type HomeModel = InteractiveModel<HomeModelView, HomeModelInteraction>;
