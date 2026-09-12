import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification, Translation } from "../utilities/types";
import { NewArticle, NewArticleSubmission } from "../validation/article";
import { ArticleDraft } from "./write-article";
import { ArticleWithTranslations } from "../utilities/types";

export type ReviewArticleNotification =
	| Notification<"submitting">
	| (Notification<"submit_success" | "submit_failure"> & { message: string });

export type ReviewArticleModelView = {
	draft: ArticleDraft;
	draftAssigneeName: Translation;
	currentArticle?: ArticleWithTranslations;
	notification: ReviewArticleNotification | null;
};

export type ReviewArticleModelInteraction = InputModelInteraction<
	"PUBLISH",
	{
		article: NewArticle;
	}
>;

export type ReviewArticleModel = InteractiveModel<
	ReviewArticleModelView,
	ReviewArticleModelInteraction
>;
