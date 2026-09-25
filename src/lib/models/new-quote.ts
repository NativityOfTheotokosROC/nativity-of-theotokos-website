import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification, Options, Translation } from "../utilities/types";
import { NewQuote } from "../validation/quote";

export type AutoCompleteInfo = {
	existingAuthors: Translation[];
	existingSources: Translation[];
};

export type Quote = {
	author: string;
	quote: string;
	source?: string;
};

export type NewQuoteNotification =
	| (Notification<"success"> & { message: string })
	| (Notification<"failure"> & { message: string })
	| Notification<"pending">;

export type NewQuoteModelView = {
	newQuoteNotification: NewQuoteNotification | null;
	autoCompleteInfo?: AutoCompleteInfo;
};

export type NewQuoteModelInteraction = InputModelInteraction<
	"ADD_QUOTE",
	{ newQuote: NewQuote } & Options<{ successCallback: () => void }>
>;

export type NewQuoteModel = InteractiveModel<
	NewQuoteModelView,
	NewQuoteModelInteraction
>;
