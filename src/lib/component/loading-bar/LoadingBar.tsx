"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { LoadingBarModel } from "../../model/loading-bar";
import "./loading-bar.css";

const LoadingBar = function ({ model }) {
	const { modelView } = model;

	return (
		<div
			className={`loading-bar bg-gray-900 h-[1.5px] sticky top-0 z-12 ${!modelView?.isLoading && "hidden"}`}
		>
			<div className={`loading-bar-progress h-full bg-[#dcb042]`} />
		</div>
	);
} satisfies ModeledVoidComponent<LoadingBarModel>;

export default LoadingBar;
