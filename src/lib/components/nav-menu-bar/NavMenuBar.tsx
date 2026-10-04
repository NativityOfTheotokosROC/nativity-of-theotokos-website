import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { useUserActions } from "../../model-implementations/user-action";
import { Navlink } from "../../utilities/types";
import { Link } from "../page-loading-bar/PageLoadingBar";
import UserNavigationWidget from "../user-navigation-widget/UserNavigationWidget";
import { LoginTooltipModel } from "../../models/login-tooltip";
import { twMerge } from "tailwind-merge";

const NavMenuBar = function ({ model }) {
	const {
		menuItems: { navlinks, loginTooltip },
	} = model.modelView;
	const userActions = useUserActions();

	return (
		<nav className="nav-menu">
			<div className="flex flex-wrap items-center justify-center gap-6 px-4 lg:gap-8">
				{[
					...navlinks.map((navlink, index) => (
						<Link
							key={index}
							href={navlink.link}
							className="navlink text-base uppercase no-underline hover:text-[#ffdc4f]"
							replace={navlink.isReplaceable}
						>
							{navlink.text}
						</Link>
					)),
				]}
				<div
					className={twMerge(
						"flex",
						loginTooltip?.modelView.isOpen &&
							"scale-103 transition duration-150 ease-out",
					)}
					data-tooltip-id={loginTooltip?.modelView.id}
				>
					<UserNavigationWidget
						model={newReadonlyModel({
							style: "dropdown",
							variant: "abbreviated",
							signIn: { navlinkVariant: "simple_link" },
							userActions,
						})}
					/>
				</div>
			</div>
		</nav>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{
		menuItems: {
			navlinks: Navlink[];
			loginTooltip?: LoginTooltipModel;
		};
	}>
>;

export default NavMenuBar;
