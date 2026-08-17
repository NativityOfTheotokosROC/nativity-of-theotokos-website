import { ModeledContainerComponent } from "@mvc-react/components";
import { PageViewModel } from "../../models/page-view";
import { InitializedModel } from "@mvc-react/mvc";
import { georgia } from "../../third-party/fonts";

const PageView = function ({ model, children }) {
	const { modelView } = model;

	return (
		<main
			style={{ borderColor: modelView?.topBarColor }}
			className={`border-t-15 border-t-[#976029] bg-[#FEF8F3] text-black`}
		>
			<div className="page-view-content flex min-h-[94svh] flex-col gap-6 p-8 py-9 md:py-10 lg:px-20">
				{modelView?.title && (
					<span
						className={`mb-2 text-[2.75rem]/tight font-semibold md:text-black ${georgia.className}`}
					>
						{modelView.title}
						<hr className="mt-4 mb-0 md:w-full" />
					</span>
				)}
				{children}
			</div>
		</main>
	);
} satisfies ModeledContainerComponent<PageViewModel>;

export default PageView;
