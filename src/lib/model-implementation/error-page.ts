import { ViewInteractionInterface } from "@mvc-react/stateful";
import {
	ErrorPageModelInteraction,
	ErrorPageModelView,
} from "../model/error-page";
import { PageLoadingBarModel } from "../model/page-loading-bar";

export function errorPageVIInterface(
	resetFunction: () => void,
	loadingBar: PageLoadingBarModel,
): ViewInteractionInterface<ErrorPageModelView, ErrorPageModelInteraction> {
	return {
		produceModelView: async function (
			interaction: ErrorPageModelInteraction,
			currentModelView: ErrorPageModelView | null,
		): Promise<ErrorPageModelView> {
			if (!currentModelView)
				throw new Error("The model is uninitialized");
			switch (interaction.type) {
				case "REPORT_ERROR": {
					loadingBar.interact({
						type: "SET_LOADING",
						input: { value: false },
					});
					return { message: interaction.input.message };
				}
				case "RETRY": {
					loadingBar.interact({
						type: "SET_LOADING",
						input: { value: true },
					});
					resetFunction();
					return currentModelView;
				}
			}
		},
	};
}
