import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Article, ArticleTicket } from "../types/general";
import { ArticleDraft } from "./edit-article";

export type ReviewArticleModelView = {
	ticket: ArticleTicket;
	draft: ArticleDraft;
	currentArticle?: Article;
};

export type ReviewArticleModelInteraction = InputModelInteraction<
	"PUBLISH",
	{
		draft: ArticleDraft;
		snippet?: string;
		authorName?: string;
		imageUrl: string;
		imageCaption: string;
	}
>;

export type ReviewArticleModel = InteractiveModel<
	ReviewArticleModelView,
	ReviewArticleModelInteraction
>;
