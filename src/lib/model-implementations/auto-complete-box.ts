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
	options?: Partial<{ closeOnBlank: boolean }>,
) {
	return {
		async produceModelView(interaction, currentModelView) {
			if (!currentModelView) throw new UninitializedModelError();
			switch (interaction.type) {
				case "TOGGLE": {
					return {
						...currentModelView,
						isOpen:
							interaction.input.value &&
							currentModelView.items.length > 0,
					};
				}
				case "FILTER": {
					const { query } = interaction.input;
					const { isOpen: isActivated } = currentModelView;
					const isBlank = query.trim() === "";
					console.log(
						`isBlank: ${isBlank}; closeOption: ${options?.closeOnBlank}`,
					);
					return {
						...currentModelView,
						query: query,
						isOpen:
							isActivated &&
							currentModelView.items.length > 0 &&
							!(options?.closeOnBlank && isBlank),
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
	options?: Partial<{ closeOnBlank: boolean }>,
) {
	const model = useInitializedStatefulInteractiveModel(
		autoCompleteBoxVIInterface(options),
		initialModelView,
	);
	return model satisfies AutoCompleteBoxModel;
}
