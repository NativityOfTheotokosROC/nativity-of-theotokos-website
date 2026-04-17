import { Model } from "@mvc-react/mvc";
import { LatestNews } from "../server-actions/home";
import { ScheduleItem } from "../types/general";

export interface BulletinSectionModelView {
	newsArticles: LatestNews;
	schedulePreview: ScheduleItem[];
}

export type BulletinSectionModel = Model<BulletinSectionModelView>;
