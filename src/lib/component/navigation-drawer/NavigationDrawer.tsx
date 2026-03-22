import SidebarDecoration from "@/public/assets/ornament_33.svg";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ModeledContainerComponent } from "@mvc-react/components";
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
import UserNavigationWidget from "../user-navigation-widget/UserNavigationWidget";
import "./navigation-drawer.css";

type MenuModelView = Pick<
	NavigationDrawerModelView,
	"navMenuItems" | "isDrawn"
>;
type MenuModelInteraction = ModelInteraction<"CLOSE_MENU">;
type MenuModel = InteractiveModel<MenuModelView, MenuModelInteraction>;

const SidebarDrawer = function ({ model }) {
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
					className={`sidebar-drawer flex flex-col h-dvh gap-4 w-60 max-w-[80vw] md:w-80 pb-3 overflow-y-auto origin-right bg-gray-900/99 border-l border-white/12 text-white focus:outline-none duration-300 ease-out data-closed:translate-x-1/4 data-closed:opacity-0 z-13`}
					transition
				>
					<SidebarDecoration className="fill-white/60 mt-2 px-3 min-h-20 h-20 max-w-full" />
					<hr className="w-3/4 opacity-50 mx-auto mt-3" />
					<nav
						className="navigation-menu flex flex-col"
						onBlur={() => {
							interact({ type: "CLOSE_MENU" });
						}}
					>
						{/* TODO: To be revised */}
						{userDetails && (
							<UserNavigationWidget
								model={{
									modelView: { type: "sidebar", userDetails },
									interact() {},
								}}
							/>
						)}
						{navlinks.map((navlink, index) => (
							<Link
								key={index}
								className="block navlink uppercase no-underline px-6 py-4 md:px-8 active:bg-gray-950 active:text-[#DCB042] hover:text-[#DCB042]"
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
} satisfies ModeledContainerComponent<InitializedModel<MenuModel>>;

const NavigationDrawer = function ({ model, children }) {
	const { modelView, interact } = model;
	const { isDrawn, navMenuItems } = modelView;

	return (
		<SidebarDrawer
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
		>
			{children}
		</SidebarDrawer>
	);
} satisfies ModeledContainerComponent<InitializedModel<NavigationDrawerModel>>;

export default NavigationDrawer;
