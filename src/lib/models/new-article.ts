import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../types/general";

export type NewArticleNotification =
	| (Notification<"success" | "failure"> & { message: string })
	| Notification<"pending">;

export type NewArticle = {
	ticketId: string;
	title: string;
	body: string;
};

export type NewArticleModelView = {
	author?: string;
	newArticleNotification: NewArticleNotification | null;
};

export type NewArticleModelInteraction =
	| InputModelInteraction<
			"SUBMIT",
			{
				newArticle: NewArticle;
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
