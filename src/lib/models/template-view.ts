import { Model } from "@mvc-react/mvc";
import { Language } from "../utilities/types";

export type TemplateViewModelView = {
	language: Language;
	variant:
		| { type: "broadcast"; unsubLink: string; prefsLink: string }
		| { type: "transactional"; includeIgnoreMessage?: boolean };
	previewText?: string;
};

export type TemplateViewModel = Model<TemplateViewModelView>;
