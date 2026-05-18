import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../types/general";

export type Quote = {
	author: string;
	quote: string;
	source?: string;
};

export type NewQuote = {
	englishQuote: Quote;
	russianQuote?: Partial<Quote>;
	scheduledDate?: string;
};

export type NewQuoteNotification =
	| (Notification<"success"> & { text: string })
	| (Notification<"failure"> & { message: string })
	| Notification<"pending">;

export type NewQuoteModelView = {
	newQuoteNotification: NewQuoteNotification | null;
};

export type NewQuoteModelInteraction = InputModelInteraction<
	"ADD_QUOTE",
	{ newQuote: NewQuote; options?: { successCallback?: () => void } }
>;

export type NewQuoteModel = InteractiveModel<
	NewQuoteModelView,
	NewQuoteModelInteraction
>;
