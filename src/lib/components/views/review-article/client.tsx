"use client";

import { ArticleTicket, ArticleDraft } from "@/src/generated/prisma/client";
import { Article } from "@/src/lib/types/general";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";

type ReviewArticleClientModel = ReadonlyModel<{
	articleTicket: ArticleTicket;
	articleDraft: ArticleDraft;
	article?: Article;
}>;

const ReviewArticleClient = function ({ model }) {
	const { articleTicket, articleDraft, article } = model.modelView;

	return <div className=""></div>;
} satisfies ModeledVoidComponent<ReviewArticleClientModel>;

export default ReviewArticleClient;
