import { ViewInteractionInterface } from "@mvc-react/stateful";
import {
	PageLoadingBarModelView,
	PageLoadingBarModelInteraction,
} from "../model/page-loading-bar";

export function pageLoadingBarVIInterface(): ViewInteractionInterface<
	PageLoadingBarModelView,
	PageLoadingBarModelInteraction
> {
	return {
		produceModelView: async function (
			interaction: PageLoadingBarModelInteraction,
		): Promise<PageLoadingBarModelView> {
			switch (interaction.type) {
				case "SET_LOADING": {
					return { isLoading: interaction.input.value };
				}
			}
		},
	};
}
