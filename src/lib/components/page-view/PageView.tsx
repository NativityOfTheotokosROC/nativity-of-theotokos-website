import { ModeledContainerComponent } from "@mvc-react/components";
import { PageViewModel } from "../../models/page-view";
import { InitializedModel } from "@mvc-react/mvc";
import { georgia } from "../../third-party/fonts";

const PageView = function ({ model, children }) {
	const { title, topBarColor } = model.modelView;

	return (
		<main
			style={{ borderColor: topBarColor }}
			className={`border-t-15 border-t-[#976029] bg-[#FEF8F3] text-black`}
		>
			<div className="new-quote-content flex flex-col gap-6 p-8 py-9 md:py-10 lg:px-20">
				<span
					className={`mb-2 text-[2.75rem]/tight font-semibold md:text-black ${georgia.className}`}
				>
					{title}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
			</div>
			{children}
		</main>
	);
} satisfies ModeledContainerComponent<InitializedModel<PageViewModel>>;

export default PageView;
