import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { NewQuote } from "../validation/quote";

export type QuotePreviewModalModelView = {
	isOpen: boolean;
	quote: NewQuote;
};

export type QuotePreviewModalModelInteraction =
	| InputModelInteraction<"OPEN", Pick<QuotePreviewModalModelView, "quote">>
	| ModelInteraction<"CLOSE">;

export type QuotePreviewModalModel = InteractiveModel<
	QuotePreviewModalModelView,
	QuotePreviewModalModelInteraction
>;
