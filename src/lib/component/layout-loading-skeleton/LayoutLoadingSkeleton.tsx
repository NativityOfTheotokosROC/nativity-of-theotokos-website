import { ViewTransition } from "react";
import LogoIcon from "@/public/assets/logo-icon.svg";
import { georgia } from "../../third-party/fonts";

export default function LayoutLoadingSkeleton() {
	return (
		<ViewTransition name="layout-loading">
			<div className="layout-loading flex h-dvh w-full flex-col items-center justify-center bg-[#fef8f3]">
				<div className="logo flex w-fit items-center justify-center gap-3 text-gray-800 select-none">
					<div className="size-18">
						<LogoIcon
							className="stroke-gray-800 object-contain object-center"
							width={72}
							height={72}
							strokeWidth={9}
						/>
					</div>
					<div
						className={`logo-text flex flex-col gap-px ${georgia.className}`}
					>
						<span className={`text-xl/snug font-semibold`}>
							{"Nativity of Theotokos"}
						</span>
						<span className={`text-base`}>
							{"Russian Orthodox Church"}
						</span>
					</div>
				</div>
			</div>
		</ViewTransition>
	);
}
