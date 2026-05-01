"use client";

import { ModeledContainerComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { PageNavigationButtonModel } from "../../models/page-navigation-button";
import { usePageLoadingBarRouter } from "../../utilities/page-loading-bar";
import Button from "./Button";

const PageNavigationButton = function ({ model, children }) {
	const { endpoint, browserNavigation } = model.modelView;
	const router = usePageLoadingBarRouter();

	return (
		<Button
			model={newReadonlyModel({
				variant: "standard",
				action: () => {
					window.open(endpoint, "_self");
					// if (browserNavigation) {
					// 	window.open(endpoint, "_self");
					// } else {
					// 	router.push(endpoint);
					// }
				},
			})}
		>
			{children}
		</Button>
	);
} satisfies ModeledContainerComponent<PageNavigationButtonModel>;

export default PageNavigationButton;
