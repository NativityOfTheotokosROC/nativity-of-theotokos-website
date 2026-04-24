import SidebarDecoration from "@/public/assets/ornament_38.svg";
import { useRouter } from "@/src/i18n/navigation";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
	ModeledContainerComponent,
	ModeledVoidComponent,
} from "@mvc-react/components";
import {
	InitializedModel,
	InteractiveModel,
	ModelInteraction,
	newReadonlyModel,
} from "@mvc-react/mvc";
import { Suspense, useContext } from "react";
import { getUserActions as originalGetUserActions } from "../../model-implementations/user-action";
import {
	NavigationDrawerModel,
	NavigationDrawerModelView,
} from "../../models/navigation-drawer";
import { Role } from "../../types/general";
import { usePageLoadingBarRouter } from "../../utilities/page-loading-bar";
import {
	Link,
	PageLoadingBarContext,
} from "../page-loading-bar/PageLoadingBar";
import UserNavigationWidget, {
	UserNavigationWidgetSkeleton,
} from "../user-navigation-widget/UserNavigationWidget";
import "./navigation-drawer.css";

type MenuModelView = Pick<NavigationDrawerModelView, "isDrawn">;
type MenuModelInteraction = ModelInteraction<"CLOSE_MENU">;
type MenuModel = InteractiveModel<MenuModelView, MenuModelInteraction>;

const NavigationDrawer = function ({ model }) {
	const { modelView, interact } = model;
	const { isDrawn, navlinks, hasUserNavigationWidget } = modelView;
	const pageLoadingBar = useContext(PageLoadingBarContext);
	const router = usePageLoadingBarRouter(useRouter);

	return (
		<SidebarDrawer
			model={{
				modelView: {
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
			<div className="flex flex-col">
				{hasUserNavigationWidget && (
					<div className="[&_.dropdown-button]:px-6 [&_.dropdown-button]:py-4 *:[&_.dropdown-button]:w-full *:[&_.dropdown-button]:bg-gray-800 md:[&_.dropdown-button]:px-8">
						<Suspense
							fallback={
								<UserNavigationWidgetSkeleton
									model={newReadonlyModel({
										variant: "full",
									})}
								/>
							}
						>
							<UserNavigationWidget
								model={newReadonlyModel({
									style: "accordion",
									variant: "full",
									getUserActions: (roles: Role[]) => {
										const userActions =
											originalGetUserActions(
												roles,
												router,
												pageLoadingBar,
											);
										return userActions.map(userAction => ({
											modelView: {
												...userAction.modelView,
												async action() {
													await interact({
														type: "CLOSE",
													});
													return userAction.modelView.action();
												},
											},
										}));
									},
								})}
							/>
						</Suspense>
					</div>
				)}
				{navlinks.map((navlink, index) => (
					<Link
						key={index}
						className="navlink block px-6 py-4 uppercase no-underline transition duration-200 ease-out hover:text-[#DCB042] active:bg-gray-950 active:text-[#DCB042] md:px-8"
						href={navlink.link}
						replace={navlink.isReplaceable}
						onClick={async () => await interact({ type: "CLOSE" })}
					>
						{navlink.text}
					</Link>
				))}
			</div>
		</SidebarDrawer>
	);
} satisfies ModeledVoidComponent<InitializedModel<NavigationDrawerModel>>;

const SidebarDrawer = function ({ model, children }) {
	const {
		modelView: { isDrawn },
		interact,
	} = model;

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
					className={`sidebar-drawer z-13 flex h-dvh w-60 max-w-[80vw] origin-right flex-col gap-4 overflow-y-auto border-l border-white/12 bg-gray-900/99 pb-3 text-white duration-300 ease-out focus:outline-none data-closed:translate-x-1/4 data-closed:opacity-0 md:w-80`}
					transition
				>
					<SidebarDecoration className="mt-2 h-20 min-h-20 max-w-full fill-white/60 px-3" />
					<hr className="mx-auto mt-3 w-3/4 opacity-50" />
					{/* TODO: To be revised */}
					{children}
				</DialogPanel>
			</div>
		</Dialog>
	);
} satisfies ModeledContainerComponent<InitializedModel<MenuModel>>;

export default NavigationDrawer;
