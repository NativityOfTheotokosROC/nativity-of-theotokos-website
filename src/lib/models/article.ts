import { ReadonlyModel } from "@mvc-react/mvc";
import { Article } from "../types/general";

export interface ArticleModelView {
	article: Article;
	permalink: string;
}

export type ArticleModel = ReadonlyModel<ArticleModelView>;
