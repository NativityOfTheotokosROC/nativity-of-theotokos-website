import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyQuote } from "../types/general";

export type DailyQuoteSectionModelView = {
	dailyQuote: DailyQuote | null;
};

export type DailyQuoteSectionModel = ReadonlyModel<DailyQuoteSectionModelView>;
