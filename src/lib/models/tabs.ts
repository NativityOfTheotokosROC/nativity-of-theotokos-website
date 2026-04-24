import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { TabModel } from "./tab";

export interface TabsModelView {
	tabs: TabModel[];
	selectedTab: number;
}

export type TabModelInteraction = InputModelInteraction<
	"SWITCH_TAB",
	{ id: number }
>;

export type TabsModel = InteractiveModel<TabsModelView, TabModelInteraction>;
