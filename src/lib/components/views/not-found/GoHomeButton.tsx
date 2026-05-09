"use client";

import { newReadonlyModel } from "@mvc-react/mvc";
import { ReactNode } from "react";
import PageNavigationButton from "../../button/PageNavigationButton";

const GoHomeButton = function ({ children }: { children: ReactNode }) {
	// const pageLoadingBar = useContext(PageLoadingBarContext);

	return (
		<PageNavigationButton
			model={newReadonlyModel({
				variant: "standard",
				endpoint: "/",
				browserNavigation: true, // TODO: True until 310 is fixed
			})}
		>
			{children}
		</PageNavigationButton>
	);
};

export default GoHomeButton;
