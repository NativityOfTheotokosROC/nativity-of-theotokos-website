import {
	ModelInteraction,
	InputModelInteraction,
	InteractiveModel,
} from "@mvc-react/mvc";
import { ArticleAuthor, Translation } from "../utilities/types";
import {
	ArticleAuthorModelInteraction,
	ArticleAuthorModelView,
} from "./article-author";

export type ArticleAuthorModalModelView = ArticleAuthorModelView & {
	isOpen: boolean;
};

export type ArticleAuthorModalModelInteraction =
	| ArticleAuthorModelInteraction
	| ModelInteraction<"OPEN">
	| InputModelInteraction<
			"OPEN",
			{
				author?: ArticleAuthor<Translation>;
			}
	  >
	| ModelInteraction<"CLOSE">;

export type ArticleAuthorModalModel = InteractiveModel<
	ArticleAuthorModalModelView,
	ArticleAuthorModalModelInteraction
>;
