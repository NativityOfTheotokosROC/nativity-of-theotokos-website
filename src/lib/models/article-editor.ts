import { Model } from "@mvc-react/mvc";

export type ArticleEditorModelView = {
	initialContent: string;
};

export type ArticleEditorModel = Model<ArticleEditorModelView>;
