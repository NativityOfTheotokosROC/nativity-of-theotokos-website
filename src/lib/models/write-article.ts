import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { Article, Notification } from "../types/general";

export type WriteArticleNotification =
	| (Notification<
			| "submit_success"
			| "submit_failure"
			| "save_draft_success"
			| "save_draft_failure"
			| "saving_draft"
			| "discarding_draft"
			| "discard_draft_failure"
			| "discard_draft_success"
	  > & {
			message: string;
	  })
	| Notification<"submitting">;

export type ArticleDraft = {
	title: string;
	body: string;
};

export type WriteArticleModelView = {
	ticketId: string;
	notification: WriteArticleNotification | null;
	canDeleteTicket: boolean;
	author?: string;
	lastSavedDraft?: ArticleDraft;
	currentArticle?: Article;
};

export type WriteArticleModelInteraction =
	| ModelInteraction<"DISCARD_DRAFT">
	| InputModelInteraction<
			"SUBMIT" | "SAVE_DRAFT",
			{
				draft: ArticleDraft;
				options?: { successCallback?: () => void };
			}
	  >;

export type WriteArticleModel = InteractiveModel<
	WriteArticleModelView,
	WriteArticleModelInteraction
>;
