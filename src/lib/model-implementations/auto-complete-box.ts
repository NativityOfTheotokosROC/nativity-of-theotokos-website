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

export function autoCompleteBoxVIInterface<I, K extends string>(
	selectCallback: (item: I) => void,
	options?: Partial<{ closeWhenBlank: boolean }>,
) {
	return {
		async produceModelView(interaction, currentModelView) {
			if (!currentModelView) throw new UninitializedModelError();
			switch (interaction.type) {
				case "OPEN": {
					const { items } = currentModelView;
					return {
						...currentModelView,
						id: interaction.input.newId ?? currentModelView.id,
						isOpen: true && items.length > 0,
					};
				}
				case "CLOSE": {
					return {
						...currentModelView,
						isOpen: false,
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
		AutoCompleteBoxModelView<I, K>,
		AutoCompleteBoxModelInteraction<K>
	>;
}

export function useAutoCompleteBox<I, K extends string>(
	initialModelView: AutoCompleteBoxModelView<I, K>,
	selectCallback: (item: I) => void,
	options?: Partial<{ closeWhenBlank: boolean }>,
) {
	const model = useInitializedStatefulInteractiveModel(
		autoCompleteBoxVIInterface<I, K>(selectCallback, options),
		initialModelView,
	);
	return model satisfies AutoCompleteBoxModel<I, K>;
}

export function useSharedAutoCompleteBox<I, K extends string>(
	initialModelView: AutoCompleteBoxModelView<I, K>,
	selectCallback: (item: I) => void,
	options?: Partial<{ closeWhenBlank: boolean }>,
) {
	return useAutoCompleteBox(initialModelView, selectCallback, options);
}
