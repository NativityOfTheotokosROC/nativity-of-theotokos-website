import { ReadonlyModel } from "@mvc-react/mvc";
import { Article } from "../types/general";

export type ArticleModelView = {
	article: Article;
	permalink: string;
	options?: Partial<{ sharingDisabled: boolean }>;
};

export type ArticleModel = ReadonlyModel<ArticleModelView>;
