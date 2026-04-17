import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import {
	DailyQuote,
	DailyReadings,
	GalleryImage,
	ScheduleItem,
} from "../types/general";
import { LatestNews } from "../server-actions/home";

export interface HomeModelView {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
	scheduleItems: ScheduleItem[];
	newsArticles: LatestNews;
	dailyGalleryImages: GalleryImage[];
}

export type HomeModelInteraction = ModelInteraction<"REFRESH">;

export type HomeModel = InteractiveModel<HomeModelView, HomeModelInteraction>;
