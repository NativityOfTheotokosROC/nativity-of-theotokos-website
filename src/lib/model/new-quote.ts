import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../type/miscellaneous";

export type Quote = {
	author: string;
	quote: string;
	source?: string;
};

export type NewQuote = {
	englishQuote: Quote;
	russianQuote?: Partial<Quote>;
	scheduledDate?: Date;
};

export type NewQuoteNotification =
	| (Notification<"success"> & { text: string })
	| (Notification<"failure"> & { message: string })
	| Notification<"pending">;

export interface NewQuoteModelView {
	newQuoteNotification: NewQuoteNotification | null;
	quoteCharacterLimit: number;
}

export type NewQuoteModelInteraction = InputModelInteraction<
	"ADD_QUOTE",
	NewQuote
>;

export type NewQuoteModel = InteractiveModel<
	NewQuoteModelView,
	NewQuoteModelInteraction
>;
