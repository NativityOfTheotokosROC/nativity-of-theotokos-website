import {
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
	Transition,
} from "@headlessui/react";
import { InitializedModel } from "@mvc-react/mvc";
import { TabsModel } from "../../models/tabs";
import { ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";

const Tabs = function ({
	model,
	children,
}: {
	model: InitializedModel<TabsModel>;
	children: ReactNode[];
}) {
	const { modelView, interact } = model;
	const {
		tabs,
		selectedTab,
		tabsPosition,
		tabsLayout,
		tabsToUnmount,
		animations,
	} = modelView;
	const [previousTab, setPreviousTab] = useState<number | undefined>();
	const slideAnimation: "slide-right" | "slide-left" | null =
		previousTab !== undefined
			? previousTab < selectedTab
				? "slide-left"
				: previousTab > selectedTab
					? "slide-right"
					: null
			: null;

	return (
		<TabGroup
			className="flex w-full flex-col gap-6 overflow-x-hidden"
			selectedIndex={selectedTab}
			onChange={index =>
				interact({ type: "SWITCH_TAB", input: { id: index } })
			}
		>
			<TabList
				className={twMerge(
					`flex max-w-full items-end gap-1 overflow-x-auto pb-2`,
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
						className={`flex max-w-full ${tabsLayout === "fill" ? "flex-1" : ""} items-center justify-center border-b-5 border-gray-300 p-4 py-2 pt-0 text-sm wrap-break-word hyphens-auto uppercase focus:outline-none data-hover:border-gray-600 data-selected:border-gray-900`}
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
						className="contents"
						unmount={
							(tabsToUnmount === "all" ||
								tabsToUnmount?.includes(index)) ??
							false
						}
					>
						{animations ? (
							<Transition
								appear
								show={selectedTab === index}
								enter="transition duration-300 ease-out"
								enterFrom={`opacity-0 ${slideAnimation === "slide-left" ? "translate-x-1/4" : slideAnimation === "slide-right" ? "-translate-x-1/4" : ""}`}
								enterTo="opacity-100 translate-x-0"
								leave="transition duration-300 ease-out"
								leaveFrom="opacity-100 translate-x-0"
								leaveTo={`opacity-0 ${slideAnimation === "slide-left" ? "-translate-x-1/4" : slideAnimation === "slide-right" ? "translate-x-1/4" : ""}`}
								afterEnter={() => setPreviousTab(selectedTab)}
								as="div"
								unmount={false}
							>
								{child}
							</Transition>
						) : (
							child
						)}
					</TabPanel>
				))}
			</TabPanels>
		</TabGroup>
	);
};

export default Tabs;
