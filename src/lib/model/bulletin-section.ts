import { Model } from "@mvc-react/mvc";
import { LatestNews } from "../server-action/home";
import { ScheduleItem } from "../type/miscellaneous";

export interface BulletinSectionModelView {
	newsArticles: LatestNews;
	schedulePreview: ScheduleItem[];
}

export type BulletinSectionModel = Model<BulletinSectionModelView>;
