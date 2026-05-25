import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import {
	QuotePreviewModalModel,
	QuotePreviewModalModelInteraction,
	QuotePreviewModalModelView,
} from "../models/quote-preview-modal";

export function useQuotePreviewModal() {
	const model = useInitializedStatefulInteractiveModel<
		QuotePreviewModalModelView,
		QuotePreviewModalModelInteraction
	>(
		{
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
		},
		{
			isOpen: false,
			englishQuote: {
				author: "",
				quote: "",
				source: undefined,
			},
			russianQuote: undefined,
		},
	);

	return model satisfies QuotePreviewModalModel;
}
