"use client";

import { useReviewArticle } from "@/src/lib/model-implementations/review-article";
import { ArticleDraft } from "@/src/lib/models/edit-article";
import { Article, ArticleTicket } from "@/src/lib/types/general";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import ReviewArticle from "./ReviewArticle";
import { useToastNotifier } from "@/src/lib/model-implementations/notifier";

type ReviewArticleClientModel = ReadonlyModel<{
	articleTicket: ArticleTicket;
	articleDraft: ArticleDraft;
	article?: Article;
}>;

const ReviewArticleClient = function ({ model }) {
	const { articleTicket, articleDraft, article } = model.modelView;
	const toastNotifier = useToastNotifier();
	const reviewArticle = useReviewArticle(
		articleTicket,
		articleDraft,
		article,
		{
			toastNotifier,
		},
	);

	return <ReviewArticle model={reviewArticle} />;
} satisfies ModeledVoidComponent<ReviewArticleClientModel>;

export default ReviewArticleClient;
