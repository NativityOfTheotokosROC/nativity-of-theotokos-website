import { Model } from "@mvc-react/mvc";
import { Language } from "../utilities/types";
import { SocialLinkModel } from "./social-link";

export type TemplateViewModelView = {
	language: Language;
	variant:
		| { type: "broadcast"; unsubLink: string; prefsLink: string }
		| { type: "transactional"; includeIgnoreMessage?: boolean };
};

export type TemplateViewModel = Model<TemplateViewModelView>;
