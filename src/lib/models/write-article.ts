import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import {
	ArticleWithTranslations,
	Notification,
	Options,
	Translation,
} from "../utilities/types";
import { NewArticleSubmission } from "../validation/article";

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
	title: Translation;
	body: Translation;
	lastSaved?: Date;
};

export type NewArticleDraft = NewArticleSubmission;

export type WriteArticleModelView = {
	ticketId: string;
	notification: WriteArticleNotification | null;
	canDeleteTicket: boolean;
	authorName?: Translation;
	lastSavedDraft?: ArticleDraft;
	currentArticle?: ArticleWithTranslations;
};

export type WriteArticleModelInteraction =
	| ModelInteraction<"DISCARD_DRAFT">
	| InputModelInteraction<
			"SAVE_DRAFT",
			{
				draft: NewArticleDraft;
			} & Options<{ successCallback: () => void }>
	  >
	| InputModelInteraction<
			"SUBMIT",
			{ submission: NewArticleSubmission } & Options<{
				successCallback: () => void;
			}>
	  >;

export type WriteArticleModel = InteractiveModel<
	WriteArticleModelView,
	WriteArticleModelInteraction
>;
