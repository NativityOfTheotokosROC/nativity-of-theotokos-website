"use client";

import { ReviewArticleModel } from "@/src/lib/models/review-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import PageView from "../../page-view/PageView";
import { useTranslations } from "next-intl";
import { useArticlePreviewModal } from "@/src/lib/model-implementations/article-preview-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePublishArticleFormSchema } from "@/src/lib/validation/publish-article-form";

const ReviewArticle = function ({ model }) {
	const { modelView, interact } = model;
	const { ticket, draft, currentArticle } = modelView;
	const t = useTranslations("reviewArticle");
	const publishArticleFormSchema = usePublishArticleFormSchema();
	const {
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(publishArticleFormSchema),
		defaultValues: {
			title: draft.title,
			body: draft.body,
			authorName:
				currentArticle?.author.name ?? ticket.assignee.name ?? "",
			snippet: currentArticle?.snippet ?? "",
			imageUrl: currentArticle?.articleImage.source ?? "",
			imageCaption: currentArticle?.articleImage.about ?? "",
		},
	});
	const articlePreviewModal = useArticlePreviewModal(
		handleSubmit(async form => {
			const { title, body, authorName, imageUrl, imageCaption, snippet } =
				form;
			await interact({
				type: "PUBLISH",
				input: {
					draft: { title, body },
					imageUrl,
					imageCaption,
					authorName,
					snippet,
				},
			});
		}),
	);

	return (
		<PageView model={newReadonlyModel({ title: t("title") })}>
			<form
				onSubmit={handleSubmit(
					async form =>
						await articlePreviewModal.interact({
							type: "OPEN",
							input: {
								title: form.title,
								body: form.body,
								authorName: form.authorName,
								dateCreated:
									currentArticle?.dateCreated ?? new Date(),
								snippet: form.snippet,
								image: {
									source: form.imageUrl,
									about: form.imageCaption,
									placeholder:
										currentArticle?.articleImage
											.placeholder,
								},
							},
						}),
				)}
			>
				<></>
			</form>
		</PageView>
	);
} satisfies ModeledVoidComponent<InitializedModel<ReviewArticleModel>>;

export default ReviewArticle;
