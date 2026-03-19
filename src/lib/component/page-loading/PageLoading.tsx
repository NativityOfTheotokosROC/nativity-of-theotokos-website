"use client";

import { ViewTransition } from "react";
import { LogoIcon } from "../miscellaneous/graphic";

export default function PageLoading() {
	return (
		<ViewTransition>
			<div className="page-loading relative flex flex-col items-center h-fit min-h-screen w-full bg-[#fef8f3]">
				<div className="min-h-fit h-full max-h-[85vh] absolute items-center justify-center w-full">
					<div
						className={`flex gap-3 h-full my-auto mx-auto items-center justify-center max-w-[25em] animate-pulse`}
					>
						<LogoIcon className="size-20 object-center object-contain stroke-gray-800" />
					</div>
				</div>
			</div>
		</ViewTransition>
	);
}
