import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { TabsModelInteraction, TabsModelView } from "../models/tabs";
import { TabModel } from "../models/tab";

export function tabsVIInterface() {
	return {
		produceModelView: async function (
			interaction: TabsModelInteraction,
			currentModelView: TabsModelView | null,
		): Promise<TabsModelView> {
			switch (interaction.type) {
				case "SWITCH_TAB": {
					if (!currentModelView)
						throw new Error("Model is uninitialized");
					return {
						...currentModelView,
						selectedTab: interaction.input.id,
					};
				}
			}
		},
	} satisfies ViewInteractionInterface<TabsModelView, TabsModelInteraction>;
}

export function useTabs(tabs: TabModel[]) {
	const model = useInitializedStatefulInteractiveModel(tabsVIInterface(), {
		tabs,
		selectedTab: 0,
	});
	return model;
}
