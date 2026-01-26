import { ModeledVoidComponent } from "@mvc-react/components";
import { NavigationMenuModel } from "../../model/navigation-menu";
import Link from "next/link";
import { faBars as menuIcon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import "@fortawesome/fontawesome-svg-core/styles.css";

const NavigationMenu = function ({ model }) {
	const { navlinks, menuType } = model.modelView;

	return (
		<nav className="nav-menu">
			{menuType == "spread" ? (
				<div className="flex gap-8 items-center justify-center px-4">
					{[
						...navlinks.map((navlink, index) => (
							<Link
								key={index}
								href={navlink.link}
								className="navlink text-base uppercase no-underline hover:text-[#DCB042]"
								replace={navlink.isInteractive}
							>
								{navlink.text}
							</Link>
						)),
					]}
				</div>
			) : (
				<Menu>
					<MenuButton as={Fragment}>
						<button className="flex items-center justify-center p-1 text-[28px] bg-transparent hover:text-[#DCB042] data-open:text-[#DCB042] data-open:bg-black/45">
							<FontAwesomeIcon icon={menuIcon} />
						</button>
					</MenuButton>
					<MenuItems
						anchor="bottom"
						transition
						className="min-w-fit w-40 flex flex-col gap-8 origin-top-right rounded-lg uppercase bg-gray-800/99 text-sm border border-white/5 p-4 text-white transition duration-300 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-92 data-closed:opacity-0 z-20"
					>
						{navlinks.map((navlink, index) => (
							<MenuItem key={index} as={Fragment}>
								<Link
									className="block"
									href={navlink.link}
									replace={navlink.isInteractive}
								>
									{navlink.text}
								</Link>
							</MenuItem>
						))}
					</MenuItems>
				</Menu>
			)}
		</nav>
	);
} as ModeledVoidComponent<NavigationMenuModel>;

export default NavigationMenu;
