import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { Article, Translation } from "../utilities/types";

export type ArticlePreviewModalModelView = {
	isOpen: boolean;
	title: Translation;
	body: Translation;
	authorName: Translation;
	dateCreated?: Date;
	image?: {
		[K in keyof Article["articleImage"]]: K extends "caption"
			? Translation
			: Article["articleImage"][K];
	};
	snippet?: Partial<Translation>;
};

export type ArticlePreviewModalModelInteraction =
	| ModelInteraction<"SUBMIT">
	| InputModelInteraction<
			"OPEN",
			Omit<ArticlePreviewModalModelView, "isOpen">
	  >
	| ModelInteraction<"CLOSE">;

export type ArticlePreviewModalModel = InteractiveModel<
	ArticlePreviewModalModelView,
	ArticlePreviewModalModelInteraction
>;
