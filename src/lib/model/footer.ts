import { ReadonlyModel } from "@mvc-react/mvc";
import { SocialLinkModel } from "./social-link";

export type Jurisdiction = {
	name: string;
	link: string;
};

export type Clergy = {
	name: string;
	link?: string;
};

export type Contact = {
	name: string;
	phone: `+${number}`;
};

export type License = {
	precedingText: string;
	linkLabel: string;
	link: string;
};

export type JurisdictionInfo = {
	diocese: Jurisdiction;
	metropolis: Jurisdiction;
	patriarch: Required<Clergy>;
	patriarchate: Jurisdiction;
};

export interface FooterModelView {
	copyrightText: string;
	description: string;
	parishEmail: string;
	jurisdictionInfo: JurisdictionInfo;
	clergy: Clergy[];
	contacts: Contact[];
	socials: SocialLinkModel[];
	licenses: License[];
}

export type FooterModel = ReadonlyModel<FooterModelView>;
