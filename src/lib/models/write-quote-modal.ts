import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { DetailedQuote } from "../utilities/quote";
import { Translation } from "../utilities/types";
import { NewQuote } from "../validation/quote";
import { WriteQuoteModelView } from "./write-quote";

export type WriteQuoteModalModelView = {
	isOpen: boolean;
} & WriteQuoteModelView;

export type WriteQuoteModalModelInteraction =
	| ModelInteraction<"OPEN">
	| InputModelInteraction<
			"OPEN",
			{
				quote?: DetailedQuote<Translation>;
				autoCompleteInfo?: WriteQuoteModalModelView["autoCompleteInfo"];
			}
	  >
	| ModelInteraction<"CLOSE">
	| InputModelInteraction<"ADD_QUOTE", { newQuote: NewQuote; id?: number }>;

export type WriteQuoteModalModel = InteractiveModel<
	WriteQuoteModalModelView,
	WriteQuoteModalModelInteraction
>;
