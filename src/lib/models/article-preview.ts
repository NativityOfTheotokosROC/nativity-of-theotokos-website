import { ReadonlyModel } from "@mvc-react/mvc";
import { Article } from "../types/general";

export type ArticlePreview = Omit<Article, "body" | "dateUpdated" | "url">;

export interface ArticlePreviewModelView {
	articlePreview: ArticlePreview;
	isDetailed?: boolean;
}

export type ArticlePreviewModel = ReadonlyModel<ArticlePreviewModelView>;
