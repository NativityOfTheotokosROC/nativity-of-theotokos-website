import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyQuote } from "../type/miscellaneous";

export interface DailyQuoteSectionModelView {
	dailyQuote: DailyQuote | null;
}

export type DailyQuoteSectionModel = ReadonlyModel<DailyQuoteSectionModelView>;
