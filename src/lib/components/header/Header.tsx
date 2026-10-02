"use client";

import LogoIcon from "@/public/assets/logo-icon.svg";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { TextAlignJustifyIcon as MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigationDrawer } from "../../model-implementations/navigation-drawer";
import { HeaderModel } from "../../models/header";
import { georgia } from "../../third-party/fonts";
import { LoginTooltipContext } from "../../utilities/contexts";
import { useUserInformation } from "../../utilities/user";
import LoginTooltip from "../login-tooltip/LoginTooltip";
import NavMenuBar from "../nav-menu-bar/NavMenuBar";
import NavigationDrawer from "../navigation-drawer/NavigationDrawer";
import { Link } from "../page-loading-bar/PageLoadingBar";
import "./header.css";

const Header = function ({ model }) {
	const { navlinks } = model.modelView;
	const isLargeScreen = useMediaQuery({ minWidth: 1024 });
	const isPortrait = useMediaQuery({ orientation: "portrait" });
	const navigationDrawer = useNavigationDrawer(navlinks);
	const t = useTranslations("header");
	const tNonDescriptive = useTranslations("nonDescriptive");
	const locale = useLocale();
	useUserInformation(); // Prefetch
	const loginTooltip = useContext(LoginTooltipContext)!;

	return (
		<header
			className={`header sticky top-px z-12 flex h-fit w-full max-w-full flex-col bg-gray-900/99`}
		>
			<div className="header-content flex flex-nowrap items-center justify-between gap-9 p-4 text-white lg:p-6 lg:px-7">
				<Link className="contents" href="/">
					<div className="logo flex w-fit items-center justify-center gap-3 select-none hover:cursor-pointer">
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
								},
							})}
						/>
					) : (
						<button
							title={tNonDescriptive("menu")}
							className={`flex items-center justify-center rounded-lg bg-transparent p-1 text-[28px] transition ease-out hover:text-[#ffdc4f] data-open:bg-black/45 data-open:text-[#ffdc4f] ${loginTooltip?.modelView.isOpen && "text-[#ffdc4f]"}`}
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
			<LoginTooltip model={loginTooltip} />
		</header>
	);
} satisfies ModeledVoidComponent<HeaderModel>;

export default Header;
