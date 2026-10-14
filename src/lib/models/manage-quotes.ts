import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { NewQuote } from "../validation/quote";
import { AutoCompleteInfo } from "./write-quote";
import { ScheduledQuote } from "./scheduled-quote";
import { DetailedQuote } from "../utilities/quote";
import { Translation } from "../utilities/types";

export type ManageQuotesModelView = {
	quotes: DetailedQuote<Translation>[];
	autoCompleteInfo: AutoCompleteInfo;
	scheduledQuotes: ScheduledQuote[];
};

export type ManageQuotesModelInteraction =
	| InputModelInteraction<"ADD_NEW_QUOTE", { newQuote: NewQuote }>
	| InputModelInteraction<"SCHEDULE_QUOTE", { quoteId: number; date: string }>
	| InputModelInteraction<"MODIFY_QUOTE", { id: number; newQuote: NewQuote }>
	| InputModelInteraction<
			"RESCHEDULE_QUOTE",
			{ quoteId: number; oldDate: string; newDate: string }
	  >
	| InputModelInteraction<"DELETE_QUOTE", { quoteId: number }>
	| InputModelInteraction<"DELETE_SCHEDULED_QUOTE", { date: string }>;

export type ManageQuotesModel = InteractiveModel<
	ManageQuotesModelView,
	ManageQuotesModelInteraction
>;
