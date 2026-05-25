import { Model } from "@mvc-react/mvc";
import { LatestArticles } from "../server-actions/home";
import { ScheduleItem } from "../types/general";

export type BulletinSectionModelView = {
	newsArticles: LatestArticles;
	schedulePreview: ScheduleItem[];
};

export type BulletinSectionModel = Model<BulletinSectionModelView>;
