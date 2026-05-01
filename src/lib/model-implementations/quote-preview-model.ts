import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import {
	QuotePreviewModalModel,
	QuotePreviewModalModelInteraction,
	QuotePreviewModalModelView,
} from "../models/quote-preview-modal";

export function useQuotePreviewModal() {
	const model = useNewStatefulInteractiveModel<
		QuotePreviewModalModelView,
		QuotePreviewModalModelInteraction
	>({
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "CLOSE": {
					if (!currentModelView)
						throw new Error("Model is not initialized");
					return { ...currentModelView, isOpen: false };
				}
				case "OPEN": {
					return {
						isOpen: true,
						englishQuote: interaction.input.englishQuote,
						russianQuote: interaction.input.russianQuote,
					};
				}
			}
		},
	});

	return model satisfies QuotePreviewModalModel;
}
