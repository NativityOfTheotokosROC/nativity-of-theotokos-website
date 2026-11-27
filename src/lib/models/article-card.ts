import { ReadonlyModel } from "@mvc-react/mvc";
import { Article, RenameProperty } from "../utilities/types";

export type ArticlePreview = RenameProperty<
	Omit<Article, "body" | "dateUpdated" | "url">,
	"snippet",
	"previewText"
>;

export type ArticleCardModelView = {
	articlePreview: ArticlePreview;
	isDetailed?: boolean;
};

export type ArticleCardModel = ReadonlyModel<ArticleCardModelView>;
