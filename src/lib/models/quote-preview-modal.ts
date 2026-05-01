import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Quote } from "./new-quote";
import { ModalToggleValue } from "./modal";

export interface QuotePreviewModalModelView {
	isOpen: boolean;
	englishQuote: Quote;
	russianQuote: Partial<Quote>;
}

export type QuotePreviewModalModelInteraction = InputModelInteraction<
	"TOGGLE",
	{ value: ModalToggleValue }
>;

export type QuotePreviewModalModel = InteractiveModel<
	QuotePreviewModalModelView,
	QuotePreviewModalModelInteraction
>;
