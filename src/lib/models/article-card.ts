import { ReadonlyModel } from "@mvc-react/mvc";
import { Article } from "../utilities/types";

export type ArticlePreview = Omit<Article, "body" | "dateUpdated" | "url">;

export type ArticleCardModelView = {
	articlePreview: ArticlePreview;
	isDetailed?: boolean;
};

export type ArticleCardModel = ReadonlyModel<ArticleCardModelView>;
