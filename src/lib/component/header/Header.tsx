"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { HeaderModel } from "../../model/header";
import { useMediaQuery } from "react-responsive";
import NavigationMenu from "./NavigationMenu";
import { newReadonlyModel } from "@mvc-react/mvc";
import LogoIcon from "@/public/ui/logo-icon.svg";
import { georgia } from "../../third-party/fonts";
import "./header.css";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";

const Header = function ({ model }) {
	const { navlinks } = model.modelView;
	const isWideScreen = useMediaQuery({ minWidth: 768 });
	const locale = useLocale();
	const router = useRouter();

	return (
		<header
			className={`header flex flex-col w-full max-w-full top-0 sticky z-10  bg-gray-900/99 h-fit`}
		>
			<div className="header-content flex flex-nowrap gap-9 justify-between p-4 lg:p-6 lg:px-7 items-center text-white">
				<div
					className="logo flex gap-3 items-center justify-center w-fit min-w-fit hover:cursor-pointer"
					onClick={() => {
						router.push("/", { locale });
					}}
				>
					<div className="size-12">
						<LogoIcon
							className="grow object-center object-contain"
							viewBox="0 0 430 430"
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
							{"Russian Orthodox Church "}
						</span>
					</div>
				</div>
				<NavigationMenu
					model={newReadonlyModel({
						navlinks,
						menuType: isWideScreen ? "spread" : "shelved",
					})}
				/>
			</div>
			<hr className="header-border self-center text-gray-500" />
		</header>
	);
} as ModeledVoidComponent<HeaderModel>;

export default Header;
