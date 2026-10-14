import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification, Options, Text, Translation } from "../utilities/types";
import { NewQuote } from "../validation/quote";
import { DetailedQuote } from "../utilities/quote";

export type AutoCompleteInfo = {
	existingAuthors: Translation[];
	existingSources: Translation[];
};

export type Quote<T extends Text = string> = {
	author: T;
	quote: T;
	source?: T;
};

export type WriteQuoteNotification =
	| (Notification<"success"> & { message: string })
	| (Notification<"failure"> & { message: string })
	| Notification<"pending">;

export type WriteQuoteModelView = {
	newQuoteNotification?: WriteQuoteNotification | null;
	autoCompleteInfo?: AutoCompleteInfo;
	quote?: DetailedQuote<Translation>;
};

export type WriteQuoteModelInteraction = InputModelInteraction<
	"ADD_QUOTE",
	{ newQuote: NewQuote; id?: number } & Options<{
		successCallback: () => void;
	}>
>;

export type WriteQuoteModel = InteractiveModel<
	WriteQuoteModelView,
	WriteQuoteModelInteraction
>;
