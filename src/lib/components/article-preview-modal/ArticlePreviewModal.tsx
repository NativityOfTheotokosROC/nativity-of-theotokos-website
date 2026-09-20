"use client";

import Article from "@/src/lib/components/views/article/Article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import {
	ArticlePreviewModalModel,
	ArticlePreviewModalModelView,
} from "../../models/article-preview-modal";
import Modal from "../modal/Modal";
import {
	DEFAULT_ARTICLE_PREVIEW_IMAGE,
	DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER,
} from "../../utilities/constants";

const ArticlePreviewModal = function ({ model }) {
	const { modelView, interact } = model;
	const { isOpen, title, authorName, body, dateCreated, snippet, image } = {
		isOpen: modelView?.isOpen,
		title: modelView?.title,
		authorName: modelView?.authorName,
		body: modelView?.body,
		dateCreated: modelView?.dateCreated,
		snippet: modelView?.snippet,
		image: modelView?.image,
	} satisfies Partial<ArticlePreviewModalModelView>;
	const t = useTranslations("articlePreview");

	return (
		<Modal
			model={newReadonlyModel({
				title: t("title"),
				size: "large",
				isOpen: isOpen ?? false,
				async onClose() {
					await interact({ type: "CLOSE" });
				},
			})}
		>
			<div className="flex w-full flex-col items-center justify-center">
				<div className="w-full rounded-none border-0 bg-gray-800 p-6 text-[#FEF8F3]">
					<span className="text-xl">{t("title")}</span>
				</div>
				<div className="article-box h-full max-h-[65svh] min-h-[5em] w-full shrink-2 overflow-y-auto">
					<Article
						model={newReadonlyModel({
							permalink: "#",
							article: {
								uri: "#",
								title: title?.english ?? "",
								body: body?.english ?? "",
								author: {
									name: authorName?.english ?? "",
								},
								dateCreated: dateCreated ?? new Date(),
								snippet: snippet?.english ?? "",
								articleImage: (image && {
									...image,
									caption: image.caption.english,
								}) ?? {
									url: DEFAULT_ARTICLE_PREVIEW_IMAGE,
									caption: t("imagePlaceholder"),
									placeholder:
										DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER,
								},
								isArticleFeatured: false,
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
