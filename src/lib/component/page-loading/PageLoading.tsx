"use client";

import { LogoIcon } from "../miscellaneous/graphic";

export default function PageLoading() {
	return (
		<div className="page-loading flex flex-col justify-center items-center h-fit min-h-[82vh] w-full bg-[#fef8f3]">
			<div
				className={`flex gap-3 items-center justify-center max-w-[25em] animate-pulse`}
			>
				<LogoIcon className="size-20 object-center object-contain stroke-gray-800" />
			</div>
		</div>
	);
}
