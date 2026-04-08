import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { Notification } from "../type/general";

export type SignOutStatus =
	| Notification<"success" | "pending">
	| (Notification<"failed"> & { message: string });

export interface SignOutModelView {
	signOutStatus: SignOutStatus | null;
}

export type SignOutModelInteraction = ModelInteraction<"SIGN_OUT">;

export type SignOutModel = InteractiveModel<
	SignOutModelView,
	SignOutModelInteraction
>;
