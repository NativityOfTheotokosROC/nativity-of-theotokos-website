import SidebarDecoration from "@/public/assets/ornament_33.svg";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	Transition,
} from "@headlessui/react";
import { ModeledVoidComponent } from "@mvc-react/components";
import {
	InitializedModel,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import {
	NavigationDrawerModel,
	NavigationDrawerModelView,
} from "../../model/navigation-drawer";
import { Link } from "../page-loading-bar/navigation";
import UserNavigation from "../user-navigation/UserNavigation";

type MenuModelView = Pick<
	NavigationDrawerModelView,
	"navMenuItems" | "isDrawn"
>;
type MenuModelInteraction = ModelInteraction<"CLOSE_MENU">;
type MenuModel = InteractiveModel<MenuModelView, MenuModelInteraction>;

const AccordionMenu = function ({ model }) {
	const {
		modelView: { navMenuItems, isDrawn },
		interact,
	} = model;
	const { navlinks } = navMenuItems;

	return (
		<Transition show={isDrawn}>
			<nav className="navigation-menu accordion-menu w-full bg-gray-800 sticky top-0 p-3 ease-in data-closed:opacity-0 data-closed:translate-y-[-101%] z-19">
				<div className="accordion-menu-content flex gap-6 lg:gap-8 items-center justify-center flex-wrap px-4">
					{[
						...navlinks.map((navlink, index) => (
							<Link
								key={index}
								href={navlink.link}
								className="navlink text-base uppercase no-underline hover:text-[#DCB042]"
								replace={navlink.isReplaceable}
								onClick={() => {
									interact({ type: "CLOSE_MENU" });
								}}
							>
								{navlink.text}
							</Link>
						)),
					]}
				</div>
			</nav>
		</Transition>
	);
} satisfies ModeledVoidComponent<InitializedModel<MenuModel>>;

const SidebarMenu = function ({ model }) {
	const {
		modelView: { navMenuItems, isDrawn },
		interact,
	} = model;
	const { navlinks, userDetails } = navMenuItems;

	return (
		<Dialog
			open={isDrawn}
			onClose={() => interact({ type: "CLOSE_MENU" })}
			className="relative z-20"
			as="div"
		>
			<div className={`fixed inset-0 z-12 flex w-screen justify-end`}>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-black/50 duration-400 ease-out data-closed:opacity-0"
				/>
				<DialogPanel
					className={`flex flex-col h-dvh gap-4 w-60 max-w-[80vw] pb-3 overflow-y-auto origin-right bg-gray-900/99 border-l border-white/12 text-white focus:outline-none duration-300 ease-out data-closed:translate-x-1/4 data-closed:opacity-0 z-13`}
					transition
				>
					<SidebarDecoration className="fill-white/60 mt-2 px-3 h-20 max-w-full" />
					<hr className="w-3/4 opacity-50 mx-auto mt-3" />
					<nav
						className="navigation-menu flex flex-col"
						onBlur={() => {
							interact({ type: "CLOSE_MENU" });
						}}
					>
						{/* TODO: To be revised */}
						{userDetails && (
							<UserNavigation
								model={{
									modelView: { type: "sidebar", userDetails },
									interact() {},
								}}
							/>
						)}
						{navlinks.map((navlink, index) => (
							<Link
								key={index}
								className="block navlink uppercase no-underline px-6 py-4 active:bg-gray-950 active:text-[#DCB042] hover:text-[#DCB042]"
								href={navlink.link}
								replace={navlink.isReplaceable}
								onClick={() => {
									interact({ type: "CLOSE_MENU" });
								}}
							>
								{navlink.text}
							</Link>
						))}
					</nav>
				</DialogPanel>
			</div>
		</Dialog>
	);
} satisfies ModeledVoidComponent<InitializedModel<MenuModel>>;

const NavigationDrawer = function ({ model }) {
	const { modelView, interact } = model;
	const { isDrawn, type, navMenuItems } = modelView;

	return (
		<>
			{type == "accordion" && (
				<AccordionMenu
					model={{
						modelView: {
							navMenuItems,
							isDrawn,
						},
						async interact(interaction) {
							switch (interaction.type) {
								case "CLOSE_MENU": {
									await interact({ type: "CLOSE" });
									break;
								}
							}
						},
					}}
				/>
			)}
			{type == "sidebar" && (
				<SidebarMenu
					model={{
						modelView: {
							navMenuItems,
							isDrawn,
						},
						async interact(interaction) {
							switch (interaction.type) {
								case "CLOSE_MENU": {
									await interact({ type: "CLOSE" });
									break;
								}
							}
						},
					}}
				/>
			)}
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<NavigationDrawerModel>>;

export default NavigationDrawer;
