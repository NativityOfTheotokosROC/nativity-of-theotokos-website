import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { TabModel } from "./tab";

export interface TabsModelView {
	tabs: TabModel[];
	selectedTab: number;
}

export type TabsModelInteraction = InputModelInteraction<
	"SWITCH_TAB",
	{ id: number }
>;

export type TabsModel = InteractiveModel<TabsModelView, TabsModelInteraction>;
