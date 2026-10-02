import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { useUserActions } from "../../model-implementations/user-action";
import { Navlink } from "../../utilities/types";
import { Link } from "../page-loading-bar/PageLoadingBar";
import UserNavigationWidget from "../user-navigation-widget/UserNavigationWidget";

const NavMenuBar = function ({ model }) {
	const {
		menuItems: { navlinks },
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
				<div className="flex" data-tooltip-id="login-tooltip">
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
		};
	}>
>;

export default NavMenuBar;
