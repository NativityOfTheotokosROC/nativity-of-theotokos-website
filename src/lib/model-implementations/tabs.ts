import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	TabsLayout,
	TabsModelInteraction,
	TabsModelView,
	TabsPosition,
	TabsToUnmount,
} from "../models/tabs";
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

export function useTabs({
	tabs,
	tabsPosition,
	tabsLayout,
	selectedTab = 0,
	animations = true,
	tabsToUnmount,
}: {
	tabs: TabModel[];
	tabsPosition?: TabsPosition;
	tabsLayout?: TabsLayout;
	selectedTab?: number;
	animations?: boolean;
	tabsToUnmount?: TabsToUnmount;
}) {
	const model = useInitializedStatefulInteractiveModel(tabsVIInterface(), {
		tabs,
		selectedTab,
		tabsPosition,
		tabsLayout,
		animation: animations,
		tabsToUnmount,
	});
	return model;
}
