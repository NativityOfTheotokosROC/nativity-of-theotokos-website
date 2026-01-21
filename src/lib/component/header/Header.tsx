"use client";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { ModeledVoidComponent } from "@mvc-react/components";
import { HeaderModel } from "../../model/header";
import { useMediaQuery } from "react-responsive";
import NavigationMenu from "./NavigationMenu";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useRouter } from "next/navigation";
import LogoIcon from "@/public/logo-icon.svg";
import { georgia } from "../../third-party/fonts";

// const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"] });
// const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });

const Header = function ({ model }) {
	const { navlinks } = model.modelView;
	const isWideScreen = useMediaQuery({ minWidth: 768 });
	const router = useRouter();

	return (
		<header className={`w-full max-w-full top-0 sticky z-10`}>
			<div className="header-content flex flex-nowrap gap-9 justify-between p-4 lg:p-6 lg:px-7 items-center bg-gray-900/99 text-white">
				<div
					className="logo flex gap-3 items-center justify-center max-w-[18em] hover:cursor-pointer"
					onClick={() => {
						router.push("/");
					}}
				>
					<div className="size-12">
						<LogoIcon
							className="grow object-center object-contain"
							viewBox="0 0 430 430"
							width={48}
							height={48}
						/>
					</div>
					<div
						className={`logo-text flex flex-col gap-1 ${georgia.className}`}
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
		</header>
	);
} as ModeledVoidComponent<HeaderModel>;

export default Header;
