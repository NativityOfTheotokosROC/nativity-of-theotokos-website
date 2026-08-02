import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../types/general";

export type NewArticleNotification =
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

export type NewArticle = {
	ticketId: string;
	title: string;
	body: string;
};

export type LastSavedDraft = Omit<NewArticle, "ticketId"> & {};

export type NewArticleModelView = {
	ticketId: string;
	author?: string;
	initialTitle?: string;
	initialBody?: string;
	lastSavedDraft?: LastSavedDraft;
	newArticleNotification: NewArticleNotification | null;
};

export type NewArticleModelInteraction =
	| InputModelInteraction<
			"SUBMIT" | "SAVE_DRAFT",
			{
				draft: NewArticle;
				options?: { successCallback?: () => void };
			}
	  >
	| InputModelInteraction<
			"PREVIEW",
			{ title: string; body: string; author: string }
	  >;

export type NewArticleModel = InteractiveModel<
	NewArticleModelView,
	NewArticleModelInteraction
>;
