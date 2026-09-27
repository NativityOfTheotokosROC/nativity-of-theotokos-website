import { Model } from "@mvc-react/mvc";
import { LatestArticles } from "../server-actions/home";
import {
	InstantaneousScheduleItemWithOptionalId,
	RecurringScheduleItemInstanceWithOptionalId,
} from "../utilities/schedule";

export type BulletinSectionModelView = {
	newsArticles: LatestArticles;
	schedulePreview: (
		| InstantaneousScheduleItemWithOptionalId
		| RecurringScheduleItemInstanceWithOptionalId
	)[];
};

export type BulletinSectionModel = Model<BulletinSectionModelView>;
