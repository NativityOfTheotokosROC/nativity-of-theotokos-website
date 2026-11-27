import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { DetailedQuote } from "../utilities/quote";
import { Translation } from "../utilities/types";
import { WriteQuoteModelInteraction, WriteQuoteModelView } from "./write-quote";

export type WriteQuoteModalModelView = WriteQuoteModelView & {
	isOpen: boolean;
};

export type WriteQuoteModalModelInteraction =
	| WriteQuoteModelInteraction
	| ModelInteraction<"OPEN">
	| InputModelInteraction<
			"OPEN",
			{
				quote?: DetailedQuote<Translation>;
				autoCompleteInfo?: WriteQuoteModalModelView["autoCompleteInfo"];
			}
	  >
	| ModelInteraction<"CLOSE">;

export type WriteQuoteModalModel = InteractiveModel<
	WriteQuoteModalModelView,
	WriteQuoteModalModelInteraction
>;
