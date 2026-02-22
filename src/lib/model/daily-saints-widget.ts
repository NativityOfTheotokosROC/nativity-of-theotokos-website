import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyReadings } from "../type/miscellaneous";
import { HymnsModalModel } from "./hymns-modal";

export interface DailySaintsWidgetModelView {
	details: Pick<
		DailyReadings,
		"currentDate" | "liturgicalWeek" | "saints" | "iconOfTheDay" | "hymns"
	>;
	hymnsModal: HymnsModalModel;
}

export type DailySaintsWidgetModel = ReadonlyModel<DailySaintsWidgetModelView>;
