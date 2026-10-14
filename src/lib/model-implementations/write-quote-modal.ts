import {
	ViewInteractionInterface,
	useNewStatefulInteractiveModel,
} from "@mvc-react/stateful";
import {
	WriteQuoteModalModel,
	WriteQuoteModalModelInteraction,
	WriteQuoteModalModelView,
} from "../models/write-quote-modal";
import { UninitializedModelError } from "../utilities/errors";
import { NewQuote } from "../validation/quote";

export function writeQuoteModalVIInterface(
	addQuoteCallback: (newQuote: NewQuote, id?: number) => Promise<void>,
) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "OPEN": {
					const input =
						"input" in interaction ? interaction.input : null;
					return {
						isOpen: true,
						quote: input ? input.quote : undefined,
						autoCompleteInfo:
							input?.autoCompleteInfo ??
							currentModelView?.autoCompleteInfo,
					};
				}
				case "CLOSE": {
					if (!currentModelView) throw new UninitializedModelError();
					return { ...currentModelView, isOpen: false };
				}
				case "ADD_QUOTE": {
					if (!currentModelView) throw new UninitializedModelError();
					const { newQuote, id } = interaction.input;
					await addQuoteCallback(newQuote, id);
					return { ...currentModelView, quote: undefined };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		WriteQuoteModalModelView,
		WriteQuoteModalModelInteraction
	>;
}

export function useWriteQuoteModal(
	addQuoteCallback: (newQuote: NewQuote, id?: number) => Promise<void>,
) {
	const model = useNewStatefulInteractiveModel(
		writeQuoteModalVIInterface(addQuoteCallback),
	);
	return model satisfies WriteQuoteModalModel;
}
