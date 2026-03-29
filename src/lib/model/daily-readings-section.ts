import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyReadings } from "../type/general";
import { HymnsModalModel } from "./hymns-modal";

export interface DailyReadingsSectionModelView {
	dailyReadings: DailyReadings | null;
	hymnsModal: HymnsModalModel;
}

export type DailyReadingsSectionModel =
	ReadonlyModel<DailyReadingsSectionModelView>;
