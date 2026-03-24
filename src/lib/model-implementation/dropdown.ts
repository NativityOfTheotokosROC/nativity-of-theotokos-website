import { ViewInteractionInterface } from "@mvc-react/stateful";
import { DropdownModelInteraction, DropdownModelView } from "../model/dropdown";

export function dropdownVIInterface() {
	return {
		async produceModelView(interaction, currentModelView) {
			if (!currentModelView) throw new Error("Model is uninitialized");
			switch (interaction.type) {
				case "OPEN": {
					return { ...currentModelView, isDrawn: true };
				}
				case "CLOSE": {
					return { ...currentModelView, isDrawn: false };
				}
				case "TOGGLE": {
					return {
						...currentModelView,
						isDrawn: !currentModelView.isDrawn,
					};
				}
				default: {
					throw new Error(
						`Invalid interaction: ${interaction.type satisfies never}`,
					);
				}
			}
		},
	} satisfies ViewInteractionInterface<
		DropdownModelView,
		DropdownModelInteraction
	>;
}
