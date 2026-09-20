import { Model } from "@mvc-react/mvc";

export type EditorModelView = {
	changeCallback: (content: string) => void;
	initialContent?: string;
	isReadonly?: boolean;
	className?: string;
};

export type EditorModel = Model<EditorModelView>;
