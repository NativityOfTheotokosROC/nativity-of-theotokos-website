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

export function autoCompleteBoxVIInterface<I>(
	selectCallback: (item: I) => void,
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
					const { index } = interaction.input;
					const { transformer, items } = currentModelView;
					const item = items[index];
					if (!item) throw new Error("Invalid selection");
					selectCallback(item);
					return {
						...currentModelView,
						query: transformer(item),
						isOpen: false,
					};
				}
			}
		},
	} satisfies ViewInteractionInterface<
		AutoCompleteBoxModelView<I>,
		AutoCompleteBoxModelInteraction
	>;
}

export function useAutoCompleteBox<I>(
	initialModelView: AutoCompleteBoxModelView<I>,
	selectCallback: (item: I) => void,
	options?: Partial<{ closeWhenBlank: boolean }>,
) {
	const model = useInitializedStatefulInteractiveModel(
		autoCompleteBoxVIInterface<I>(selectCallback, options),
		initialModelView,
	);
	return model satisfies AutoCompleteBoxModel<I>;
}
