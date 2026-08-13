import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Article, Notification } from "../types/general";

export type EditArticleNotification =
	| (Notification<
			| "submit_success"
			| "submit_failure"
			| "save_draft_success"
			| "save_draft_failure"
			| "saving_draft"
	  > & {
			message: string;
	  })
	| Notification<"submitting">;

export type ArticleDraft = {
	ticketId: string;
	title: string;
	body: string;
};

export type LastSavedDraft = Omit<ArticleDraft, "ticketId"> & {};

export type EditArticleModelView = {
	ticketId: string;
	notification: EditArticleNotification | null;
	author?: string;
	lastSavedDraft?: LastSavedDraft;
	currentArticle?: Article;
};

export type EditArticleModelInteraction = InputModelInteraction<
	"SUBMIT" | "SAVE_DRAFT",
	{
		draft: ArticleDraft;
		options?: { successCallback?: () => void };
	}
>;

export type EditArticleModel = InteractiveModel<
	EditArticleModelView,
	EditArticleModelInteraction
>;
