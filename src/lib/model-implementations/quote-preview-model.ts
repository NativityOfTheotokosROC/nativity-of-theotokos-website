import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import {
	QuotePreviewModalModel,
	QuotePreviewModalModelInteraction,
	QuotePreviewModalModelView,
} from "../models/quote-preview-modal";
import { BLANK_TRANSLATION } from "../utilities/constants";

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
							quote: interaction.input.quote,
						};
					}
				}
			},
		},
		{
			isOpen: false,
			quote: {
				author: BLANK_TRANSLATION,
				quote: BLANK_TRANSLATION,
				source: BLANK_TRANSLATION,
			},
		},
	);

	return model satisfies QuotePreviewModalModel;
}
