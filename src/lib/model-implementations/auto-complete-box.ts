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

export function autoCompleteBoxVIInterface(
	options?: Partial<{ closeWhenBlank: boolean }>,
) {
	return {
		async produceModelView(interaction, currentModelView) {
			if (!currentModelView) throw new UninitializedModelError();
			switch (interaction.type) {
				case "TOGGLE": {
					const { items } = currentModelView;
					return {
						...currentModelView,
						isOpen: interaction.input.value && items.length > 0,
					};
				}
				case "FILTER": {
					const { query } = interaction.input;
					const queryBlank = query.trim() === "";
					const close = options?.closeWhenBlank && queryBlank;
					return close
						? {
								...currentModelView,
								query,
								isOpen: false,
							}
						: {
								...currentModelView,
								query,
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

export function useAutoCompleteBox(
	initialModelView: AutoCompleteBoxModelView,
	options?: Partial<{ closeWhenBlank: boolean }>,
) {
	const model = useInitializedStatefulInteractiveModel(
		autoCompleteBoxVIInterface(options),
		initialModelView,
	);
	return model satisfies AutoCompleteBoxModel;
}
