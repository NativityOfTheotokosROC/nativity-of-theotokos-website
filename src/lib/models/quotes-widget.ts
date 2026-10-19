import { Model } from "@mvc-react/mvc";
import { DetailedQuote } from "../utilities/quote";
import { Translation } from "../utilities/types";
import { QuoteModelView } from "./quote";

export type QuotesWidgetModelView = {
	quotes: DetailedQuote<Translation>[];
	pinnedRows?: string[];
} & Pick<QuoteModelView, "modifiers">;

export type QuotesWidgetModel = Model<QuotesWidgetModelView>;
