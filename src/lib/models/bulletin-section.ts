import { Model } from "@mvc-react/mvc";
import { LatestArticles } from "../server-actions/home";
import { ScheduleItem } from "../types/general";

export interface BulletinSectionModelView {
	newsArticles: LatestArticles;
	schedulePreview: ScheduleItem[];
}

export type BulletinSectionModel = Model<BulletinSectionModelView>;
