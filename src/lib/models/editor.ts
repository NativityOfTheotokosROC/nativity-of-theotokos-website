import { InputModelInteraction, InteractiveModel, Model } from "@mvc-react/mvc";

export type EditorModelView = {
	initialContent?: string;
	changeCallback?: (content: string) => Promise<void>;
	isReadonly?: boolean;
	className?: string;
};

export type EditorModel = Model<EditorModelView>;
