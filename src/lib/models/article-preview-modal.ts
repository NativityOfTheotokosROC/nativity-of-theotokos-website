import {
	ModelInteraction,
	InteractiveModel,
	InputModelInteraction,
} from "@mvc-react/mvc";
import { ArticleDraft } from "./edit-article";
import { Article } from "../types/general";

export type ArticlePreviewModalModelView = {
	isOpen: boolean;
	draft: ArticleDraft;
	previewAuthor: string;
	currentArticle?: Article;
};

export type ArticlePreviewModalModelInteraction =
	| ModelInteraction<"SUBMIT">
	| InputModelInteraction<
			"OPEN",
			// TODO: Not ... ideal
			{ draft: ArticleDraft; author: string; currentArticle?: Article }
	  >
	| ModelInteraction<"CLOSE">;

export type ArticlePreviewModalModel = InteractiveModel<
	ArticlePreviewModalModelView,
	ArticlePreviewModalModelInteraction
>;
