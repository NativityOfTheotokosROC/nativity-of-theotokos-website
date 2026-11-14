import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import {
	ArticleWithTranslations,
	Notification,
	Translation,
} from "../utilities/types";
import { NewArticle } from "../validation/article";
import { ArticleDraft } from "./write-article";

export type ReviewArticleNotification =
	| Notification<"submitting">
	| (Notification<"submit_failure"> & {
			message: string;
	  })
	| (Notification<"submit_success"> & {
			message: string;
			publishingDate?: Date;
	  });

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
