import {
	ModelInteraction,
	InteractiveModel,
	InputModelInteraction,
} from "@mvc-react/mvc";
import { NewArticle } from "./new-article";

export type ArticlePreviewModalModelView = {
	isOpen: boolean;
	draft: NewArticle;
	previewAuthor: string;
};

export type ArticlePreviewModalModelInteraction =
	| ModelInteraction<"SUBMIT">
	| InputModelInteraction<"OPEN", { draft: NewArticle; author: string }>
	| ModelInteraction<"CLOSE">;

export type ArticlePreviewModalModel = InteractiveModel<
	ArticlePreviewModalModelView,
	ArticlePreviewModalModelInteraction
>;
