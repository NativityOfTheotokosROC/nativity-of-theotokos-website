import z from "zod";
import { SocialLinkModel } from "../models/social-link";
import { newReadonlyModel } from "@mvc-react/mvc";

export const DEFAULT_ARTICLE_PREVIEW_IMAGE =
	"/assets/article-preview-placeholder.svg";
export const DEFAULT_PROFILE_PHOTO = "/assets/default-profile-photo-max.webp";
export const DEFAULT_PROFILE_PHOTO_PLACEHOLDER =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAiElEQVR4AXyMwQmDQBRE53tatYPYTkgqSIhpIgcrSA65xxAD9qJYkB4U9LYo82FXT354MMx/TPB8vec9AmwuCkOQTQUvGGOQZQ+F2UleEBFYaxURcf91IUkOqOpGYXaGLsRxhHt6xfl0VNLbBewoqTCOEz75D8W/VPJvAXZeYOj7AW3bKczsyAIAAP//yCTEDAAAAAZJREFUAwAYPz5RUVHMrAAAAABJRU5ErkJggg==";
export const DEFAULT_ARTICLE_PREVIEW_IMAGE_PLACEHOLDER =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAa0lEQVR4AXyKSwoAIQxDUz8g6tKNoPe/jkdRdyLiOAVXAxOatiRPlFL2nwWOrLUwxpzvOwyMMTDn5JaI+N7FwFoLe29orZFSgvf+9mDgDXLOiDFCSokQApxzDIkjKKXQWkPvHbVW9psRER4AAAD//wDRBJ0AAAAGSURBVAMAvkw0q8hhr/QAAAAASUVORK5CYII=";

export const MAILING_ADDRESS = z
	.email()
	.parse(process.env.NEXT_PUBLIC_MAILING_ADDRESS);
export const BLANK_TRANSLATION = { english: "", russian: "" };
const [facebook, x, whatsapp, instagram]: (string | undefined)[] = [
	process.env.NEXT_PUBLIC_FACEBOOK,
	process.env.NEXT_PUBLIC_X,
	process.env.NEXT_PUBLIC_WHATSAPP,
	process.env.NEXT_PUBLIC_INSTAGRAM,
];
const SOCIALS: SocialLinkModel[] = [];
if (facebook) {
	SOCIALS.push(
		newReadonlyModel({
			details: { type: "Facebook", link: facebook as any },
		}),
	);
}
if (x) {
	SOCIALS.push(
		newReadonlyModel({
			details: { type: "X", link: x as any },
		}),
	);
}
if (whatsapp) {
	SOCIALS.push(
		newReadonlyModel({
			details: { type: "WhatsApp", link: whatsapp as any },
		}),
	);
}
if (instagram) {
	SOCIALS.push(
		newReadonlyModel({
			details: { type: "Instagram", link: instagram as any },
		}),
	);
}
export { SOCIALS };
