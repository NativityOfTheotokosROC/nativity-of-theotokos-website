import { ReadonlyModel } from "@mvc-react/mvc";
import { NewsArticle } from "../types/general";

export type NewsArticlePreview = Omit<
	NewsArticle,
	"body" | "dateUpdated" | "url"
>;

export interface NewsArticlePreviewModelView {
	articlePreview: NewsArticlePreview;
	isFeatured: boolean;
}

export type NewsArticlePreviewModel =
	ReadonlyModel<NewsArticlePreviewModelView>;
