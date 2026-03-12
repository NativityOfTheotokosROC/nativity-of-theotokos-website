"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { LoadingBarModel } from "../../model/loading-bar";
import "./loading-bar.css";

const LoadingBar = function ({ model }) {
	const { modelView } = model;

	return (
		<div className={`loading-bar h-[1.5px]`}>
			<div
				className={`loading-bar-progress h-full bg-[#dcb042] ${!modelView?.isLoading && "hidden"}`}
			/>
		</div>
	);
} satisfies ModeledVoidComponent<LoadingBarModel>;

export default LoadingBar;
