import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../types/general";

export type SignOutStatus =
	| Notification<"success" | "pending">
	| (Notification<"failed"> & { message: string });

export interface SignOutModelView {
	signOutStatus: SignOutStatus | null;
}

export type SignOutModelInteraction = InputModelInteraction<
	"SIGN_OUT",
	{ hardNavigate: boolean }
>; // TODO: Tweak mvc-react

export type SignOutModel = InteractiveModel<
	SignOutModelView,
	SignOutModelInteraction
>;
