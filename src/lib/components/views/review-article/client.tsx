"use client";

import { useToastNotifier } from "@/src/lib/model-implementations/notifier";
import { useReviewArticle } from "@/src/lib/model-implementations/review-article";
import { ArticleDraft, NewArticleDraft } from "@/src/lib/models/write-article";
import {
	ArticleWithTranslations,
	Translation,
} from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import ReviewArticle from "./ReviewArticle";

type ReviewArticleClientModel = ReadonlyModel<{
	articleDraft: ArticleDraft;
	draftAssigneeName: Translation;
	ticketId?: string;
	article?: ArticleWithTranslations;
}>;

const ReviewArticleClient = function ({ model }) {
	const { articleDraft, draftAssigneeName, ticketId, article } =
		model.modelView;
	const toastNotifier = useToastNotifier();
	const reviewArticle = useReviewArticle(
		articleDraft,
		draftAssigneeName,
		ticketId,
		article,
		{
			toastNotifier,
		},
	);

	return <ReviewArticle model={reviewArticle} />;
} satisfies ModeledVoidComponent<ReviewArticleClientModel>;

export default ReviewArticleClient;
