"use client";

import LogoIcon from "@/public/assets/logo-icon.svg";
import { useRouter } from "@/src/i18n/navigation";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { TextAlignJustifyIcon as MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Suspense, useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { Tooltip } from "react-tooltip";
import { useNavigationDrawer } from "../../model-implementations/navigation-drawer";
import { getUserActions } from "../../model-implementations/user-action";
import { HeaderModel } from "../../models/header";
import { georgia } from "../../third-party/fonts";
import { Navlink } from "../../types/general";
import { usePageLoadingBarRouter } from "../../utilities/page-loading-bar";
import { useUserInformation } from "../../utilities/user";
import NavigationDrawer from "../navigation-drawer/NavigationDrawer";
import {
	Link,
	PageLoadingBarContext,
} from "../page-loading-bar/PageLoadingBar";
import UserNavigationWidget, {
	UserNavigationWidgetSkeleton,
} from "../user-navigation-widget/UserNavigationWidget";
import "./header.css";
import { LoginTooltipContext } from "../../utilities/contexts";

const Header = function ({ model }) {
	const { navlinks, hasUserNavigationWidget } = model.modelView;
	const router = usePageLoadingBarRouter(useRouter);
	const isLargeScreen = useMediaQuery({ minWidth: 1024 });
	const isPortrait = useMediaQuery({ orientation: "portrait" });
	const navigationDrawer = useNavigationDrawer(
		navlinks,
		hasUserNavigationWidget,
	);
	const t = useTranslations("header");
	const tNonDescriptive = useTranslations("nonDescriptive");
	const locale = useLocale();
	useUserInformation(); // Prefetch
	const loginTooltip = useContext(LoginTooltipContext);

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
								className="logo-icon object-contain object-center"
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
							{!(isPortrait && locale === "ru") && ( // Too much real estate
								<span className={`text-sm`}>
									{t("logoBottom")}
								</span>
							)}
						</div>
					</div>
				</Link>
				<div className="header-interactive flex gap-4">
					{isLargeScreen ? (
						<NavMenuBar
							model={newReadonlyModel({
								menuItems: {
									navlinks,
									hasUserNavigationWidget,
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
							data-tooltip-id={"login-tooltip"}
						>
							<MenuIcon className="size-8" strokeWidth={1.75} />
						</button>
					)}
				</div>
			</div>
			{!isLargeScreen && <NavigationDrawer model={navigationDrawer} />}
			<hr className="header-border self-center text-gray-500" />
			<Tooltip
				id="login-tooltip"
				isOpen={loginTooltip?.modelView.isOpen}
				content={loginTooltip?.modelView.text}
				place="bottom-end"
			/>
		</header>
	);
} satisfies ModeledVoidComponent<HeaderModel>;

const NavMenuBar = function ({ model }) {
	const {
		menuItems: { navlinks, hasUserNavigationWidget },
	} = model.modelView;
	const pageLoadingBar = useContext(PageLoadingBarContext);
	const router = usePageLoadingBarRouter(useRouter);

	return (
		<nav className="nav-menu">
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
				{hasUserNavigationWidget && (
					<Suspense
						fallback={
							<UserNavigationWidgetSkeleton
								model={newReadonlyModel({
									variant: "abbreviated",
								})}
							/>
						}
					>
						<div
							className="contents"
							data-tooltip-id={"login-tooltip"}
						>
							<UserNavigationWidget
								model={newReadonlyModel({
									style: "dropdown",
									variant: "abbreviated",
									getUserActions(roles) {
										return getUserActions(
											roles,
											router,
											pageLoadingBar,
										);
									},
								})}
							/>
						</div>
					</Suspense>
				)}
			</div>
		</nav>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{
		menuItems: {
			navlinks: Navlink[];
			hasUserNavigationWidget: boolean;
		};
	}>
>;

export default Header;
