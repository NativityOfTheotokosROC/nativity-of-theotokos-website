import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { InitializedModel } from "@mvc-react/mvc";
import { TabsModel } from "../../models/tabs";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const Tabs = function ({
	model,
	children,
}: {
	model: InitializedModel<TabsModel>;
	children: ReactNode[];
}) {
	const { modelView, interact } = model;
	const { tabs, selectedTab, tabsPosition, tabsLayout } = modelView;

	return (
		<TabGroup
			className="flex flex-col gap-6"
			selectedIndex={selectedTab}
			onChange={index =>
				interact({ type: "SWITCH_TAB", input: { id: index } })
			}
		>
			<TabList
				className={twMerge(
					`flex items-end gap-1 max-w-full`,
					tabsPosition === "center"
						? "justify-center"
						: tabsPosition === "start"
							? "justify-start"
							: tabsPosition === "end"
								? "justify-end"
								: undefined,
					tabsLayout === "fill" ? "w-full" : undefined,
				)}
			>
				{tabs.map((tab, index) => (
					<Tab
						key={index}
						className="flex flex-1 max-w-full items-center justify-center border-b-5 border-gray-300 p-4 py-2 text-sm wrap-break-word hyphens-auto uppercase focus:outline-none data-hover:border-gray-600 data-selected:border-gray-900"
						as={"button"}
					>
						{tab.modelView.name}
					</Tab>
				))}
			</TabList>
			<TabPanels>
				{children.map((child, index) => (
					<TabPanel key={index} className="contents" unmount={false}>
						{child}
					</TabPanel>
				))}
			</TabPanels>
		</TabGroup>
	);
};

export default Tabs;
