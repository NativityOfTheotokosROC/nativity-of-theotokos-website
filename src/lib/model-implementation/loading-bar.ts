import { ViewInteractionInterface } from "@mvc-react/stateful";
import {
	LoadingBarModelInteraction,
	LoadingBarModelView,
} from "../model/loading-bar";

export function loadingBarVIInterface(): ViewInteractionInterface<
	LoadingBarModelView,
	LoadingBarModelInteraction
> {
	return {
		produceModelView: async function (
			interaction: LoadingBarModelInteraction,
		): Promise<LoadingBarModelView> {
			switch (interaction.type) {
				case "SET_LOADING": {
					return { isLoading: interaction.input.value };
				}
			}
		},
	};
}
