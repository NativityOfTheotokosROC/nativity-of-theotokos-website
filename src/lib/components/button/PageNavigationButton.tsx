"use client";

import { useRouter } from "@/src/i18n/navigation";
import { newReadonlyModel } from "@mvc-react/mvc";
import { PageNavigationButtonModel } from "../../models/page-navigation-button";
import { usePageLoadingBarRouter } from "../../utilities/page-loading-bar";
import Button from "./Button";
import { ModeledContainerComponent } from "@mvc-react/components";

const PageNavigationButton = function ({ model, children }) {
	const { endpoint, browserNavigation } = model.modelView;
	const router = usePageLoadingBarRouter(useRouter);

	return (
		<Button
			model={newReadonlyModel({
				variant: "standard",
				action: () => {
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
