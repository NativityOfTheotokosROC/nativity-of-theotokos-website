import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { ArticleAuthor, Translation } from "../utilities/types";
import { NewArticleAuthor } from "../validation/article";

export type ArticleAuthorModelView = {
	author?: ArticleAuthor<Translation>;
};

export type ArticleAuthorModelInteraction =
	| InputModelInteraction<
			"ADD_AUTHOR",
			{
				author: NewArticleAuthor;
				id?: number;
				successCallback?: (author: ArticleAuthor<Translation>) => void;
			}
	  >
	| InputModelInteraction<
			"DELETE_PROFILE",
			{ id: number; successCallback?: () => void }
	  >;

export type ArticleAuthorModel = InteractiveModel<
	ArticleAuthorModelView,
	ArticleAuthorModelInteraction
>;
