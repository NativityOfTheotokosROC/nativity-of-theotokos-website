"use client";

import { newReadonlyModel } from "@mvc-react/mvc";
import { ReactNode, useContext } from "react";
import PageNavigationButton from "../../button/PageNavigationButton";
import { PageLoadingBarContext } from "../../page-loading-bar/PageLoadingBar";

const GoHomeButton = function ({ children }: { children: ReactNode }) {
	const pageLoadingBar = useContext(PageLoadingBarContext);

	return (
		<PageNavigationButton
			model={newReadonlyModel({
				variant: "standard",
				endpoint: "/",
				browserNavigation: pageLoadingBar.modelView === null,
			})}
		>
			{children}
		</PageNavigationButton>
	);
};

export default GoHomeButton;
