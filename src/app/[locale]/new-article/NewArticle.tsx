"use client";

import Editor from "@/src/lib/components/editor/Editor";
import { NewArticleModel } from "@/src/lib/models/new-article";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";

const NewArticle = function ({ model }) {
	const { modelView } = model;
	const {} = modelView;
	const t = useTranslations("newArticle");

	return (
		<main className="new-quote border-t-15 border-t-[#976029] bg-[#FEF8F3] text-black">
			<div className="new-quote-content flex flex-col gap-6 p-8 py-9 md:py-10 lg:px-20">
				<span
					className={`mb-2 text-[2.75rem]/tight font-semibold md:text-black ${georgia.className}`}
				>
					{t("metaTitle")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<form action="">
					<div className="flex flex-col gap-3">
						<input
							className={`w-full overflow-clip rounded-lg border bg-white p-4`}
							placeholder={t("title")}
							name={"article-title"}
						/>
						<Editor
							model={newReadonlyModel({
								initialContent: t("bodyPlaceholder"),
							})}
						/>
					</div>
				</form>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<InitializedModel<NewArticleModel>>;

export default NewArticle;
