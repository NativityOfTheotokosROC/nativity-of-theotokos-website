import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { TabModel } from "./tab";

export type TabsPosition = "start" | "center" | "end";

export type TabsModelView = {
	tabs: TabModel[];
	selectedTab: number;
	tabsPosition?: TabsPosition;
};

export type TabsModelInteraction = InputModelInteraction<
	"SWITCH_TAB",
	{ id: number }
>;

export type TabsModel = InteractiveModel<TabsModelView, TabsModelInteraction>;
