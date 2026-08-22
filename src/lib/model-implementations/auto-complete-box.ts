import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	AutoCompleteBoxModel,
	AutoCompleteBoxModelInteraction,
	AutoCompleteBoxModelView,
} from "../models/auto-complete-box";
import { UninitializedModelError } from "../utilities/errors";

export function autoCompleteBoxVIInterface() {
	return {
		async produceModelView(interaction, currentModelView) {
			if (!currentModelView) throw new UninitializedModelError();
			switch (interaction.type) {
				case "TOGGLE": {
					return {
						...currentModelView,
						isOpen:
							currentModelView.items.length > 0 &&
							interaction.input.value == "open",
					};
				}
				case "FILTER": {
					const { query } = interaction.input;
					const close =
						currentModelView.isOpen && query.trim() === "";
					return {
						...currentModelView,
						query: query,
						isOpen: currentModelView.items.length > 0 && !close,
					};
				}
				case "SELECT": {
					const { value, index } = interaction.input;
					currentModelView.selectCallback(value, index);
					return { ...currentModelView, query: value, isOpen: false };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		AutoCompleteBoxModelView,
		AutoCompleteBoxModelInteraction
	>;
}

export function useAutoCompleteBox(initialModelView: AutoCompleteBoxModelView) {
	const model = useInitializedStatefulInteractiveModel(
		autoCompleteBoxVIInterface(),
		initialModelView,
	);
	return model satisfies AutoCompleteBoxModel;
}
