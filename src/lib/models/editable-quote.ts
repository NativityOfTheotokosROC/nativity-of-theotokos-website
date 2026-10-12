import { Model } from "@mvc-react/mvc";
import { DetailedQuote } from "../utilities/quote";
import { Translation } from "../utilities/types";
import { QuoteModelView } from "./quote";

export type EditableQuoteModelView = {
	quote: DetailedQuote<Translation>;
	isLanguageSwitchable?: boolean;
} & Pick<QuoteModelView, "modifiers">;

export type EditableQuoteModel = Model<EditableQuoteModelView>;
