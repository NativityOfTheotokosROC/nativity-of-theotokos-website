"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { PageLoadingBarModel } from "../../model/page-loading-bar";
import LoadingBar from "../loading-bar/LoadingBar";

export const PageLoadingBarContext = createContext<PageLoadingBarModel>({
	interact: async function () {
		throw new Error("The context is uninitialized");
	},
	modelView: null,
});

const PageLoadingBar = function () {
	const { modelView, interact } = useContext(PageLoadingBarContext);
	const currentPathName = usePathname();
	const [initialPathName, setInitialPathName] = useState(currentPathName);

	useEffect(() => {
		const _ = async () => {
			if (initialPathName != currentPathName && modelView?.isLoading) {
				await interact({
					type: "SET_LOADING",
					input: { value: false },
				});
				setInitialPathName(currentPathName);
			}
		};
		_();
	}, [currentPathName, initialPathName, interact, modelView?.isLoading]);

	return (
		<div className="bg-gray-900 h-fit w-full sticky top-0 z-12">
			<LoadingBar model={{ modelView }} />
		</div>
	);
};

export default PageLoadingBar;
