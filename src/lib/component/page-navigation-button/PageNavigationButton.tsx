"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { PageNavigationButtonModel } from "../../model/page-navigation-button";
import { usePageLoadingBarRouter } from "../../utility/page-loading-bar";
import { useRouter } from "@/src/i18n/navigation";

const PageNavigationButton = function ({ model }) {
	const { endpoint, buttonContent } = model.modelView;
	const router = usePageLoadingBarRouter(useRouter);

	return (
		<button
			className="w-30 rounded-lg bg-[#250203]/82 p-4 text-white hover:bg-[#250203]/92 active:bg-[#250203]"
			onClick={() => {
				router.push(endpoint);
			}}
		>
			{buttonContent}
		</button>
	);
} satisfies ModeledVoidComponent<PageNavigationButtonModel>;

export default PageNavigationButton;
