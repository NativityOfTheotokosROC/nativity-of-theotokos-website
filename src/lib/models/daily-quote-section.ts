import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyQuote } from "../types/general";

export interface DailyQuoteSectionModelView {
	dailyQuote: DailyQuote | null;
}

export type DailyQuoteSectionModel = ReadonlyModel<DailyQuoteSectionModelView>;
