import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import {
	ArticleAuthorWithTranslations,
	MessageNotification,
	Notification,
} from "../utilities/types";
import { NewArticleAuthor } from "../validation/article";

export type AssignArticleNotification =
	| Notification<"submitting">
	| MessageNotification<"submit_success" | "submit_failure">;

export type AssignArticleModelView = {
	suggestions?: Required<ArticleAuthorWithTranslations>[];
	notification: AssignArticleNotification | null;
};

export type AssignArticleModelInteraction = InputModelInteraction<
	"ASSIGN_ARTICLE",
	{ author: NewArticleAuthor; successCallback?: () => void }
>;

export type AssignArticleModel = InteractiveModel<
	AssignArticleModelView,
	AssignArticleModelInteraction
>;
