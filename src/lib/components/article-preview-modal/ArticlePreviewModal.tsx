"use client";

import Article from "@/src/lib/components/views/article/Article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { ArticlePreviewModalModel } from "../../models/article-preview-modal";
import Modal from "../modal/Modal";

const ArticlePreviewModal = function ({ model }) {
	const { modelView, interact } = model;
	const { isOpen, draft, previewAuthor, currentArticle } = {
		isOpen: modelView?.isOpen,
		draft: modelView?.draft,
		previewAuthor: modelView?.previewAuthor,
		currentArticle: modelView?.currentArticle,
	};
	const { title, body } = { title: draft?.title, body: draft?.body };
	const t = useTranslations("articlePreview");

	return (
		<Modal
			model={{
				modelView: { title: t("title"), isOpen: isOpen ?? false },
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
			<div className="flex w-full flex-col items-center justify-center">
				<div className="w-full rounded-none border-0 bg-gray-800 p-6 text-[#FEF8F3]">
					<span className="text-xl">{t("title")}</span>
				</div>
				<div className="article-box max-h-[65svh] w-full overflow-y-auto">
					<Article
						model={newReadonlyModel({
							permalink: "#",
							article: {
								uri: currentArticle?.uri ?? "#",
								title: title ?? "",
								body: body ?? "",
								author: {
									name:
										currentArticle?.author.name ??
										previewAuthor ??
										"",
								},
								dateCreated:
									currentArticle?.dateCreated ?? new Date(),
								snippet: currentArticle?.snippet ?? "",
								articleImage: currentArticle?.articleImage ?? {
									source: "/assets/article-preview-placeholder.svg",
									about: t("imagePlaceholder"),
									placeholder:
										"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAa0lEQVR4AXyKSwoAIQxDUz8g6tKNoPe/jkdRdyLiOAVXAxOatiRPlFL2nwWOrLUwxpzvOwyMMTDn5JaI+N7FwFoLe29orZFSgvf+9mDgDXLOiDFCSokQApxzDIkjKKXQWkPvHbVW9psRER4AAAD//wDRBJ0AAAAGSURBVAMAvkw0q8hhr/QAAAAASUVORK5CYII=",
								},
							},
							options: {
								sharingDisabled: true,
								editingDisabled: true,
							},
						})}
					/>
				</div>
				<div className="mt-3 flex w-full items-center justify-center gap-4 p-5">
					<button
						className="rounded-lg bg-[#513433] p-4 text-white hover:bg-[#250203]/90 active:bg-[#250203]"
						onClick={async () => {
							await interact({ type: "CLOSE" });
						}}
					>
						{t("continueEdit")}
					</button>
					<button
						className="break-word min-w-[8em] rounded-lg bg-[#513433] p-4 hyphens-auto text-white hover:bg-[#250203]/90 active:bg-[#250203]"
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
} satisfies ModeledVoidComponent<ArticlePreviewModalModel>;

export default ArticlePreviewModal;
