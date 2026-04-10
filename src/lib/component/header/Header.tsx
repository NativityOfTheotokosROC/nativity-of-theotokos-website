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
import { getUserActions } from "../../model-implementation/user-action";
import { HeaderModel } from "../../model/header";
import { UserNavigationWidgetModel } from "../../model/user-navigation-widget";
import { georgia } from "../../third-party/fonts";
import { Navlink } from "../../type/general";
import NavigationDrawer from "../navigation-drawer/NavigationDrawer";
import { Link } from "../page-loading-bar/PageLoadingBar";
import { usePageLoadingBarRouter } from "../../utility/page-loading-bar";
import UserNavigationWidget from "../user-navigation-widget/UserNavigationWidget";
import "./header.css";
import { use, useContext } from "react";
import { PageLoadingBarContext } from "../page-loading-bar/PageLoadingBar";

const Header = function ({ model }) {
	const router = usePageLoadingBarRouter(useRouter);
	const pageLoadingBar = useContext(PageLoadingBarContext);
	const { navlinks } = model.modelView;
	const userDetails = use(model.modelView.userDetails);
	const isLargeScreen = useMediaQuery({ minWidth: 1024 });
	const isPortrait = useMediaQuery({ orientation: "portrait" });
	const userActions =
		userDetails &&
		getUserActions(userDetails.roles, router, pageLoadingBar);
	const navigationDrawer = useNavigationDrawer({
		navlinks,
		userDetails: userDetails
			? {
					user: {
						name: userDetails.name,
						avatar: userDetails.avatar,
					},
					userActions: userActions!,
				}
			: null,
	});
	const t = useTranslations("header");
	const tNonDescriptive = useTranslations("nonDescriptive");
	const locale = useLocale();

	return (
		<header
			className={`header sticky top-px z-11 flex h-fit w-full max-w-full flex-col bg-gray-900/99`}
		>
			<div className="header-content flex flex-nowrap items-center justify-between gap-9 p-4 text-white lg:p-6 lg:px-7">
				<Link className="contents" href="/">
					<div
						className="logo flex w-fit items-center justify-center gap-3 select-none hover:cursor-pointer"
						onClick={() => {
							router.push("/");
						}}
					>
						<div className="size-12">
							<LogoIcon
								className="object-contain object-center"
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
								menuItems: {
									navlinks,
									userNavigationWidget: newReadonlyModel({
										userDetails: userDetails
											? {
													user: userDetails,
													userActions: userActions!,
												}
											: null,
										style: "dropdown",
										variant: "abbreviated",
									}),
								},
							})}
						/>
					) : (
						<button
							title={tNonDescriptive("menu")}
							className="flex items-center justify-center rounded-lg bg-transparent p-1 text-[28px] hover:text-[#DCB042] data-open:bg-black/45 data-open:text-[#DCB042]"
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

const NavMenu = function ({ model }) {
	const {
		type,
		menuItems: { navlinks, userNavigationWidget },
	} = model.modelView;

	return (
		<nav className="nav-menu">
			{type == "horizontal" && (
				<div className="flex flex-wrap items-center justify-center gap-6 px-4 lg:gap-8">
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
					{userNavigationWidget.modelView.userDetails && (
						<UserNavigationWidget model={userNavigationWidget} />
					)}
				</div>
			)}
			{type == "vertical" && (
				<div className="flex flex-col">
					{userNavigationWidget.modelView.userDetails && (
						<div className="bg-gray-800 [&_.dropdown-button]:px-6 *:[&_.dropdown-button]:w-full *:[&_.dropdown-button]:py-4">
							<UserNavigationWidget
								model={userNavigationWidget}
							/>
						</div>
					)}
					{navlinks.map((navlink, index) => (
						<Link
							key={index}
							className="navlink block px-6 py-4 uppercase no-underline hover:text-[#DCB042] active:bg-gray-950 active:text-[#DCB042] md:px-8"
							href={navlink.link}
							replace={navlink.isReplaceable}
						>
							{navlink.text}
						</Link>
					))}
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

export default Header;
