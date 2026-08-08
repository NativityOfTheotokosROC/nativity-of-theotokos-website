import {
	ModelInteraction,
	InteractiveModel,
	InputModelInteraction,
} from "@mvc-react/mvc";
import { ArticleDraft } from "./new-article";

export type ArticlePreviewModalModelView = {
	isOpen: boolean;
	draft: ArticleDraft;
	previewAuthor: string;
};

export type ArticlePreviewModalModelInteraction =
	| ModelInteraction<"SUBMIT">
	| InputModelInteraction<"OPEN", { draft: ArticleDraft; author: string }>
	| ModelInteraction<"CLOSE">;

export type ArticlePreviewModalModel = InteractiveModel<
	ArticlePreviewModalModelView,
	ArticlePreviewModalModelInteraction
>;
