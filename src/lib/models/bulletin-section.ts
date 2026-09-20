import { Model } from "@mvc-react/mvc";
import { LatestArticles } from "../server-actions/home";
import {
	InstantaneousScheduleItem,
	RecurringScheduleItemInstance,
} from "../utilities/types";

export type BulletinSectionModelView = {
	newsArticles: LatestArticles;
	schedulePreview: (
		| InstantaneousScheduleItem
		| RecurringScheduleItemInstance
	)[];
};

export type BulletinSectionModel = Model<BulletinSectionModelView>;
