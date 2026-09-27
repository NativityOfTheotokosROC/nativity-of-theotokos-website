import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { LatestArticles } from "../server-actions/home";
import { DailyQuote, DailyReadings, GalleryImage } from "../utilities/types";
import {
	InstantaneousScheduleItemWithOptionalId,
	RecurringScheduleItemInstanceWithOptionalId,
} from "../utilities/schedule";

export type HomeModelView = {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
	scheduleItems: (
		| InstantaneousScheduleItemWithOptionalId
		| RecurringScheduleItemInstanceWithOptionalId
	)[];
	articles: LatestArticles;
	dailyGalleryImages: GalleryImage[];
};

export type HomeModelInteraction = ModelInteraction<"REFRESH">;

export type HomeModel = InteractiveModel<HomeModelView, HomeModelInteraction>;
