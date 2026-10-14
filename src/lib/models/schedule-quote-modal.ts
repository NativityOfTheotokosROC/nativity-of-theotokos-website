import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { MakeOptional, Translation } from "../utilities/types";
import { ScheduledQuote } from "./scheduled-quote";

export type ScheduleQuoteModalModelView = {
	isOpen: boolean;
	quote: MakeOptional<ScheduledQuote<Translation>, "date">;
};

export type ScheduleQuoteModalModelInteraction =
	| InputModelInteraction<
			"OPEN",
			{ quote: MakeOptional<ScheduledQuote<Translation>, "date"> }
	  >
	| InputModelInteraction<
			"SCHEDULE_QUOTE",
			{ quoteId: number; date: string; oldDate?: string }
	  >
	| ModelInteraction<"CLOSE">;

export type ScheduleQuoteModalModel = InteractiveModel<
	ScheduleQuoteModalModelView,
	ScheduleQuoteModalModelInteraction
>;
