import { Model } from "@mvc-react/mvc";
import { Language } from "../utilities/types";
import { SocialLinkModel } from "./social-link";
import { TemplateViewModelView } from "./template-view";

export type EmailFooterModelView = {
	language: Language;
	variant: TemplateViewModelView["variant"];
	socials?: SocialLinkModel[];
};

export type EmailFooterModel = Model<EmailFooterModelView>;
