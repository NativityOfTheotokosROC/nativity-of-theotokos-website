"use client";

import LogoIcon from "@/public/assets/logo-icon.svg";
import { useRouter } from "@/src/i18n/navigation";
import { ModeledVoidComponent } from "@mvc-react/components";
import {
	InitializedModel,
	newReadonlyModel,
	ReadonlyModel,
} from "@mvc-react/mvc";
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
import { Navlink } from "../../type/miscellaneous";
import { UserNavigationWidgetModel } from "../../model/user-navigation-widget";
import UserNavigationWidget from "../user-navigation-widget/UserNavigationWidget";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { userNavigationWidgetVIInterface } from "../../model-implementation/user-navigation-widget";

const NavMenu = function ({ model }) {
	const {
		type,
		menuItems: { navlinks, userNavigationWidget },
	} = model.modelView;
	return (
		<nav className="nav-menu">
			{type == "horizontal" && (
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
			)}
			{type == "vertical" && (
				<div className="flex flex-col">
					{userNavigationWidget.modelView.userDetails && (
						<UserNavigationWidget
							model={{
								modelView: {
									...userNavigationWidget.modelView,
									type: "sidebar",
								},
								interact: userNavigationWidget.interact,
							}}
						/>
					)}
					{navlinks.map((navlink, index) => (
						<Link
							key={index}
							className="block navlink uppercase no-underline px-6 py-4 md:px-8 active:bg-gray-950 active:text-[#DCB042] hover:text-[#DCB042]"
							href={navlink.link}
							replace={navlink.isReplaceable}
						>
							{navlink.text}
						</Link>
					))}
					{userNavigationWidget.modelView.userDetails && (
						<UserNavigationWidget
							model={{
								modelView: {
									...userNavigationWidget.modelView,
									type: "navbar",
								},
								interact: userNavigationWidget.interact,
							}}
						/>
					)}
				</div>
			)}
		</nav>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{
		type: "horizontal" | "vertical";
		menuItems: {
			navlinks: Navlink[];
			userNavigationWidget: InitializedModel<UserNavigationWidgetModel>;
		};
	}>
>;

const Header = function ({ model }) {
	const { navlinks, userDetails } = model.modelView;
	const isLargeScreen = useMediaQuery({ minWidth: 1024 });
	const isPortrait = useMediaQuery({ orientation: "portrait" });
	const navigationDrawerType = (
		isPortrait ? "sidebar" : "accordion"
	) satisfies NavigationDrawerType;
	const navigationDrawer = useNavigationDrawer(
		{
			navlinks,
			userDetails,
		},
		navigationDrawerType,
	);
	const router = usePageLoadingBarRouter(useRouter);
	const userNavigationWidget = useInitializedStatefulInteractiveModel(
		userNavigationWidgetVIInterface(router),
		{
			type: isLargeScreen ? ("navbar" as const) : ("sidebar" as const),
			userDetails,
		},
	);
	const t = useTranslations("header");
	const tNonDescriptive = useTranslations("nonDescriptive");
	const locale = useLocale();

	return (
		<header
			className={`header flex flex-col w-full max-w-full top-0 sticky z-11 bg-gray-900/99 h-fit`}
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
								type: "horizontal",
								menuItems: { navlinks, userNavigationWidget },
							})}
						/>
					) : (
						<button
							title={tNonDescriptive("menu")}
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
			{!isLargeScreen && (
				<NavigationDrawer model={navigationDrawer}>
					<NavMenu
						model={newReadonlyModel({
							type: "vertical",
							menuItems: { navlinks, userNavigationWidget },
						})}
					/>
				</NavigationDrawer>
			)}
			<hr className="header-border self-center text-gray-500" />
		</header>
	);
} satisfies ModeledVoidComponent<HeaderModel>;

export default Header;
