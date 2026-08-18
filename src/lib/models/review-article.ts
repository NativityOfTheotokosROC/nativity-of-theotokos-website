import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Article, ArticleTicket, Notification } from "../types/general";
import { ArticleDraft } from "./write-article";

export type ReviewArticleNotification =
	| Notification<"submitting">
	| (Notification<"submit_success" | "submit_failure"> & { message: string });

export type ReviewArticleModelView = {
	ticket: ArticleTicket;
	draft: ArticleDraft;
	currentArticle?: Article;
	notification: ReviewArticleNotification | null;
};

export type ReviewArticleModelInteraction = InputModelInteraction<
	"PUBLISH",
	{
		draft: ArticleDraft;
		authorName: string;
		imageUrl: string;
		imageCaption: string;
		snippet?: string;
	}
>;

export type ReviewArticleModel = InteractiveModel<
	ReviewArticleModelView,
	ReviewArticleModelInteraction
>;
