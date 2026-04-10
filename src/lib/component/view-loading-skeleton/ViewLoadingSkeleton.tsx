"use cache";

import { ViewTransition } from "react";
import LogoIcon from "@/public/assets/logo-icon.svg";

export default function ViewLoadingSkeleton() {
	return (
		<ViewTransition name="page-loading">
			<div className="page-loading relative z-12 flex h-fit min-h-screen w-full flex-col items-center bg-[#fef8f3]">
				<div className="absolute h-full max-h-[85vh] min-h-fit w-full items-center justify-center">
					<div
						className={`mx-auto my-auto flex h-full max-w-[25em] animate-pulse items-center justify-center gap-3`}
					>
						<LogoIcon className="size-20 stroke-gray-800 object-contain object-center" />
					</div>
				</div>
			</div>
		</ViewTransition>
	);
}
