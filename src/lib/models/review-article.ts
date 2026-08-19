import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Article, Notification } from "../types/general";
import { ArticleDraft } from "./write-article";

export type ReviewArticleNotification =
	| Notification<"submitting">
	| (Notification<"submit_success" | "submit_failure"> & { message: string });

export type ReviewArticleModelView = {
	draft: ArticleDraft;
	draftAssigneeName: string;
	currentArticle?: Article & { isArticleFeatured: boolean };
	notification: ReviewArticleNotification | null;
};

export type ReviewArticleModelInteraction = InputModelInteraction<
	"PUBLISH",
	{
		draft: ArticleDraft;
		imageUrl: string;
		imageCaption: string;
		isArticleFeatured: boolean;
		authorName?: string;
		snippet?: string;
	}
>;

export type ReviewArticleModel = InteractiveModel<
	ReviewArticleModelView,
	ReviewArticleModelInteraction
>;
