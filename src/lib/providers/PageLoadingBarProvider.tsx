"use client";

import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { ReactNode } from "react";
import { PageLoadingBarContext } from "../components/page-loading-bar/PageLoadingBar";
import { pageLoadingBarVIInterface } from "../model-implementations/page-loading-bar";

const PageLoadingBarProvider = function ({
	children,
}: {
	children: ReactNode;
}) {
	const pageLoadingBar = useInitializedStatefulInteractiveModel(
		pageLoadingBarVIInterface(),
		{ isLoading: false },
	);

	return (
		<PageLoadingBarContext.Provider value={pageLoadingBar}>
			{children}
		</PageLoadingBarContext.Provider>
	);
};

export default PageLoadingBarProvider;
