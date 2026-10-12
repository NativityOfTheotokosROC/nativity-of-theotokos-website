import {
	ViewInteractionInterface,
	useNewStatefulInteractiveModel,
} from "@mvc-react/stateful";
import {
	WriteQuoteModalModel,
	WriteQuoteModalModelInteraction,
	WriteQuoteModalModelView,
} from "../models/write-quote-modal";

export function writeQuoteModalVIInterface(
	addQuoteCallback: WriteQuoteModalModelView["addQuoteCallback"],
) {
	return {
		async produceModelView(interaction, currentModelView) {
			const initErrorMessage = "The model is uninitialized";
			switch (interaction.type) {
				case "OPEN": {
					const input =
						"input" in interaction ? interaction.input : null;
					return {
						addQuoteCallback,
						isOpen: true,
						quote: input ? input.quote : undefined,
						autoCompleteInfo:
							input?.autoCompleteInfo ??
							currentModelView?.autoCompleteInfo,
					};
				}
				case "CLOSE": {
					if (!currentModelView) throw new Error(initErrorMessage);
					return { ...currentModelView, isOpen: false };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		WriteQuoteModalModelView,
		WriteQuoteModalModelInteraction
	>;
}

export function useWriteQuoteModal(
	addQuoteCallback: WriteQuoteModalModelView["addQuoteCallback"],
) {
	const model = useNewStatefulInteractiveModel(
		writeQuoteModalVIInterface(addQuoteCallback),
	);
	return model satisfies WriteQuoteModalModel;
}
