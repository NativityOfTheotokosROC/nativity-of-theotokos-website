import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyReadings } from "../utilities/types";
import { HymnsModalModel } from "./hymns-modal";

export type DailyReadingsSectionModelView = {
	dailyReadings: DailyReadings | null;
	hymnsModal: HymnsModalModel;
};

export type DailyReadingsSectionModel =
	ReadonlyModel<DailyReadingsSectionModelView>;
