"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { LoadingBarModel } from "../../model/loading-bar";
import "./loading-bar.css";
import { motion } from "motion/react";

const LoadingBar = function ({ model }) {
	const { modelView } = model;

	return (
		<div className={`loading-bar h-[1.5px]`}>
			{modelView?.isLoading && (
				<motion.div
					exit={{ width: "100%", opacity: 0 }}
					transition={{
						duration: 0.3,
						ease: "easeIn",
					}}
					className={`loading-bar-progress h-full bg-[#dcb042]`}
				/>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<LoadingBarModel>;

export default LoadingBar;
