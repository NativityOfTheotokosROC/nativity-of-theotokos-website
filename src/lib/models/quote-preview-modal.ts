import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { Quote } from "./new-quote";

export type QuotePreviewModalModelView = {
	isOpen: boolean;
	englishQuote: Quote;
	russianQuote?: Partial<Quote>;
};

export type QuotePreviewModalModelInteraction =
	| InputModelInteraction<
			"OPEN",
			Pick<QuotePreviewModalModelView, "englishQuote" | "russianQuote">
	  >
	| ModelInteraction<"CLOSE">;

export type QuotePreviewModalModel = InteractiveModel<
	QuotePreviewModalModelView,
	QuotePreviewModalModelInteraction
>;
