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
		produceModelView: async function (
			interaction: AutoCompleteBoxModelInteraction,
			currentModelView?:
				| Readonly<AutoCompleteBoxModelView>
				| null
				| undefined,
		): Promise<AutoCompleteBoxModelView> {
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
					const value = interaction.input.value;
					currentModelView.selectCallback(value);
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
