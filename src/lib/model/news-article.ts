import { ReadonlyModel } from "@mvc-react/mvc";
import { NewsArticle } from "../type/general";

export interface NewsArticleModelView {
	article: NewsArticle;
	permalink: string;
}

export type NewsArticleModel = ReadonlyModel<NewsArticleModelView>;
