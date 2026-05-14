"use client";

import { ModeledContainerComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { PageNavigationButtonModel } from "../../models/page-navigation-button";
import Button from "./Button";
import { usePageLoadingBarRouter } from "@/src/lib/utilities/page-loading-bar";

const PageNavigationButton = function ({ model, children }) {
	const { endpoint, browserNavigation } = model.modelView;
	console.log("page navigation button perhaps");
	const router = usePageLoadingBarRouter();
	console.log("pageloadingbar check");

	return (
		<Button
			model={newReadonlyModel({
				variant: "standard",
				action: () => {
					// window.open(endpoint, "_self");
					if (browserNavigation) {
						window.open(endpoint, "_self");
					} else {
						router.push(endpoint);
					}
				},
			})}
		>
			{children}
		</Button>
	);
} satisfies ModeledContainerComponent<PageNavigationButtonModel>;

export default PageNavigationButton;
