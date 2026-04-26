import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { InitializedModel } from "@mvc-react/mvc";
import { TabsModel } from "../../models/tabs";
import { ReactNode } from "react";

const Tabs = function ({
	model,
	children,
}: {
	model: InitializedModel<TabsModel>;
	children: ReactNode[];
}) {
	const { modelView, interact } = model;
	const { tabs, selectedTab } = modelView;

	return (
		<TabGroup
			className="flex flex-col gap-6"
			selectedIndex={selectedTab}
			onChange={index => {
				interact({ type: "SWITCH_TAB", input: { id: index } });
			}}
		>
			<TabList className="flex items-center gap-1">
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						className="flex items-center border-b-5 border-gray-300 p-4 py-2 text-sm uppercase focus:outline-none data-hover:border-gray-600 data-selected:border-gray-900"
						as={"button"}
					>
						{tab.modelView.name}
					</Tab>
				))}
			</TabList>
			<TabPanels>
				{children.map((child, index) => (
					<TabPanel
						key={index}
						className="flex flex-col gap-3"
						unmount={false}
					>
						{child}
					</TabPanel>
				))}
			</TabPanels>
		</TabGroup>
	);
};

export default Tabs;
