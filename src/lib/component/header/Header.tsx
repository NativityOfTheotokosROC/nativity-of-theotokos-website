"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { HeaderModel } from "../../model/header";
import { useMediaQuery } from "react-responsive";
import NavigationMenu from "./NavigationMenu";
import { newReadonlyModel } from "@mvc-react/mvc";
import { georgia } from "../../third-party/fonts";
import { useRouter } from "@/src/i18n/navigation";
import { Link, usePageLoadingBarRouter } from "../page-loading-bar/navigation";
import LogoIcon from "@/public/assets/logo-icon.svg";
import "./header.css";

const Header = function ({ model }) {
	const { navlinks } = model.modelView;
	const isWideScreen = useMediaQuery({ minWidth: 1024 });
	const navigationMenuType = isWideScreen ? "horizontal" : "vertical";
	const router = usePageLoadingBarRouter(useRouter);

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
							<span className={`text-lg`}>
								{"Nativity of the Theotokos"}
							</span>
							<span className={`text-sm`}>
								{"Russian Orthodox Church"}
							</span>
						</div>
					</div>
				</Link>
				<NavigationMenu
					model={newReadonlyModel({
						navlinks,
						menuType: navigationMenuType,
					})}
				/>
			</div>
			<hr className="header-border self-center text-gray-500" />
		</header>
	);
} satisfies ModeledVoidComponent<HeaderModel>;

export default Header;
