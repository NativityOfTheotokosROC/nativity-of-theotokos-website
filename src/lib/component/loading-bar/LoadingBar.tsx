"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { LoadingBarModel } from "../../model/loading-bar";
import "./loading-bar.css";

const LoadingBar = function ({ model }) {
	const { modelView } = model;

	return (
		<div
			className={`loading-bar h-[1.5px] bg-[#dcb042] sticky top-0 z-12 ${!modelView?.isLoading && "hidden"}`}
		/>
	);
} satisfies ModeledVoidComponent<LoadingBarModel>;

export default LoadingBar;
