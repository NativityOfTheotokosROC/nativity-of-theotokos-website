import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import {
	ArticleAuthor,
	MessageNotification,
	Notification,
} from "../types/general";

export type AssignArticleNotification =
	| Notification<"submitting">
	| MessageNotification<"submit_success" | "submit_failure">;

export type AssignArticleModelView = {
	suggestions?: Required<ArticleAuthor>[];
	notification: AssignArticleNotification | null;
};

export type AssignArticleModelInteraction = InputModelInteraction<
	"ASSIGN_ARTICLE",
	{ author: Required<ArticleAuthor>; successCallback?: () => Promise<void> }
>;

export type AssignArticleModel = InteractiveModel<
	AssignArticleModelView,
	AssignArticleModelInteraction
>;
