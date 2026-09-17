import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { LatestArticles } from "../server-actions/home";
import {
	DailyQuote,
	DailyReadings,
	GalleryImage,
	InstantaneousScheduleItem,
	RecurringScheduleItemInstance,
} from "../utilities/types";

export type HomeModelView = {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
	scheduleItems: (
		| InstantaneousScheduleItem
		| RecurringScheduleItemInstance
	)[];
	articles: LatestArticles;
	dailyGalleryImages: GalleryImage[];
};

export type HomeModelInteraction = ModelInteraction<"REFRESH">;

export type HomeModel = InteractiveModel<HomeModelView, HomeModelInteraction>;
