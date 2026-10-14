import { Model } from "@mvc-react/mvc";
import { DetailedQuote } from "../utilities/quote";
import { Text, Translation } from "../utilities/types";

export type ScheduledQuote<T extends Text = Translation> = DetailedQuote<T> & {
	date: Date;
};

export type ScheduledQuoteModelView = {
	quote: ScheduledQuote<Translation>;
	modifiers?: {
		editCallback: (id: number) => void;
		deleteCallback: (id: number) => void;
	};
};

export type ScheduledQuoteModel = Model<ScheduledQuoteModelView>;
