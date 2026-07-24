import { Model } from "@mvc-react/mvc";

export type EditorModelView = {
	initialContent: string;
};

export type EditorModel = Model<EditorModelView>;
