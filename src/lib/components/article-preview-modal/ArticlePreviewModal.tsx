import { ModeledVoidComponent } from "@mvc-react/components";
import { ArticlePreviewModalModel } from "../../models/article-preview-modal";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import Modal from "../modal/Modal";
import { useTranslations } from "next-intl";
import Article from "@/src/app/[locale]/news/[article]/Article";

const ArticlePreviewModal = function ({ model }) {
	const { modelView, interact } = model;
	const { isOpen, draft, previewAuthor } = modelView;
	const { title, body } = draft;
	const t = useTranslations("articlePreview");
	const tCaptions = useTranslations("imageCaptions");

	return (
		<Modal
			model={{
				modelView: { title: t("title"), isOpen },
				async interact(interaction) {
					switch (interaction.type) {
						case "TOGGLE": {
							switch (interaction.input.value) {
								case "close": {
									return await interact({ type: "CLOSE" });
								}
							}
						}
					}
				},
			}}
		>
			<div className="flex w-full max-w-full min-w-full flex-col items-center justify-center *:px-8">
				<div className="mb-4 w-full rounded-none border-0 bg-gray-800 p-4 text-[#FEF8F3]">
					<span className="text-lg">{t("title")}</span>
				</div>
				<Article
					model={newReadonlyModel({
						permalink: "#",
						article: {
							uri: "#",
							title,
							body,
							author: previewAuthor,
							dateCreated: new Date(),
							snippet: "",
							articleImage: {
								source: "/assets/article-preview-placeholder.svg",
								about: tCaptions("newsArticleImage"),
							},
						},
					})}
				/>
				<div className="mt-3 flex w-full items-center justify-center p-5">
					<button
						className="w-[8em] rounded-lg bg-[#513433] p-4 text-white hover:bg-[#250203]/90 active:bg-[#250203]"
						onClick={async () => {
							await interact({ type: "CLOSE" });
						}}
					>
						{t("continueEdit")}
					</button>
					<button
						className="w-[8em] rounded-lg bg-[#513433] p-4 text-white hover:bg-[#250203]/90 active:bg-[#250203]"
						onClick={async () => {
							await interact({ type: "SUBMIT" });
						}}
					>
						{t("submit")}
					</button>
				</div>
			</div>
		</Modal>
	);
} satisfies ModeledVoidComponent<InitializedModel<ArticlePreviewModalModel>>;

export default ArticlePreviewModal;
