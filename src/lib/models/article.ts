import { ReadonlyModel } from "@mvc-react/mvc";
import { Article } from "../utilities/types";

export type ArticleModelView = {
	article: Article;
	permalink: string;
	options?: Partial<{
		isSharingDisabled: boolean;
		isEditingDisabled: boolean;
	}>;
};

export type ArticleModel = ReadonlyModel<ArticleModelView>;
