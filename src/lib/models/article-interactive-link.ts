import { Model } from "@mvc-react/mvc";

export type ArticleInteractiveLinkModelView = {
	title: string;
	link: string;
};

export type ArticleInteractiveLinkModel =
	Model<ArticleInteractiveLinkModelView>;
