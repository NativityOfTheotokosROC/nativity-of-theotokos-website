import { ReadonlyModel } from "@mvc-react/mvc";

type SocialLinkTypeObject<N extends string, L extends string> = {
	type: N;
	link: L;
};

export type Details =
	| SocialLinkTypeObject<"Facebook", `https://facebook.com/${string}`>
	| SocialLinkTypeObject<"Instagram", `https://instagram.com/${string}`>
	| SocialLinkTypeObject<"X", `https://x.com/${string}`>
	| SocialLinkTypeObject<"GitHub", `https://github.com/${string}`>
	| SocialLinkTypeObject<"YouTube", `https://youtube.com/${string}`>
	| SocialLinkTypeObject<"WhatsApp", `https://wa.me/${string}`>
	| SocialLinkTypeObject<"Email", `mailto:${string}`>;

export interface SocialLinkModelView {
	details: Details;
}

export type SocialLinkModel = ReadonlyModel<SocialLinkModelView>;
