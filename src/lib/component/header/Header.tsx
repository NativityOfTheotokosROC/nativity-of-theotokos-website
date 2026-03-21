"use client";

import LogoIcon from "@/public/assets/logo-icon.svg";
import { useRouter } from "@/src/i18n/navigation";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { TextAlignJustifyIcon as MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import { useNavigationDrawer } from "../../model-implementation/navigation-drawer";
import { HeaderModel } from "../../model/header";
import { NavigationDrawerType } from "../../model/navigation-drawer";
import { georgia } from "../../third-party/fonts";
import NavigationDrawer from "../navigation-drawer/NavigationDrawer";
import { Link, usePageLoadingBarRouter } from "../page-loading-bar/navigation";
import "./header.css";
import { MenuItems } from "../../type/miscellaneous";

const NavMenu = function ({ model }) {
	const {
		menuItems: { navlinks },
	} = model.modelView;
	return (
		<nav className="nav-menu">
			<div className="flex gap-6 lg:gap-8 items-center justify-center flex-wrap px-4">
				{[
					...navlinks.map((navlink, index) => (
						<Link
							key={index}
							href={navlink.link}
							className="navlink text-base uppercase no-underline hover:text-[#DCB042]"
							replace={navlink.isReplaceable}
						>
							{navlink.text}
						</Link>
					)),
				]}
			</div>
		</nav>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ menuItems: MenuItems }>>;

const Header = function ({ model }) {
	const { navlinks } = model.modelView;
	const isLargeScreen = useMediaQuery({ minWidth: 1024 });
	const isPortrait = useMediaQuery({ orientation: "portrait" });
	const navigationDrawerType = (
		isPortrait ? "sidebar" : "accordion"
	) satisfies NavigationDrawerType;
	const navigationDrawer = useNavigationDrawer(
		{ navlinks, userDetails: null },
		navigationDrawerType,
	);
	const router = usePageLoadingBarRouter(useRouter);
	const t = useTranslations("header");
	const locale = useLocale();

	return (
		<header
			className={`header flex flex-col w-full max-w-full top-0 sticky z-10 bg-gray-900/99 h-fit`}
		>
			<div className="header-content flex flex-nowrap gap-9 justify-between p-4 lg:p-6 lg:px-7 items-center text-white">
				<Link href="/">
					<div
						className="logo flex gap-3 items-center justify-center w-fit min-w-fit hover:cursor-pointer select-none"
						onClick={() => {
							router.push("/");
						}}
					>
						<div className="size-12">
							<LogoIcon
								className="object-center object-contain"
								width={48}
								height={48}
								strokeWidth={9}
							/>
						</div>
						<div
							className={`logo-text flex flex-col gap-px ${georgia.className}`}
						>
							<span className={`text-lg/snug`}>
								{t("logoTop")}
							</span>
							{!(isPortrait && locale == "ru") && ( // Too much real estate
								<span className={`text-sm`}>
									{t("logoBottom")}
								</span>
							)}
						</div>
					</div>
				</Link>
				<div className="header-interactive flex gap-4">
					{isLargeScreen ? (
						<NavMenu
							model={newReadonlyModel({
								menuItems: { navlinks, userDetails: null },
							})}
						/>
					) : (
						<button
							title="Menu"
							className="flex items-center justify-center p-1 text-[28px] bg-transparent hover:text-[#DCB042] data-open:text-[#DCB042] data-open:bg-black/45 rounded-lg"
							onClick={() => {
								navigationDrawer.interact({ type: "TOGGLE" });
							}}
						>
							<MenuIcon className="size-8" strokeWidth={1.75} />
						</button>
					)}
				</div>
			</div>
			{!isLargeScreen && <NavigationDrawer model={navigationDrawer} />}
			<hr className="header-border self-center text-gray-500" />
		</header>
	);
} satisfies ModeledVoidComponent<HeaderModel>;

export default Header;
