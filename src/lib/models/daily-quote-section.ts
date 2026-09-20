import { ReadonlyModel } from "@mvc-react/mvc";
import { DailyQuote } from "../utilities/types";

export type DailyQuoteSectionModelView = {
	dailyQuote: DailyQuote | null;
};

export type DailyQuoteSectionModel = ReadonlyModel<DailyQuoteSectionModelView>;
