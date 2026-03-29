import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { Notification } from "../type/general";

export type SignOutStatus =
	| Notification<"success" | "pending">
	| (Notification<"failed"> & { message: string });

export interface ForbiddenModelView {
	signOutStatus: SignOutStatus | null;
}

export type ForbiddenModelInteraction = ModelInteraction<
	"SIGN_OUT" | "GO_HOME"
>;

export type ForbiddenModel = InteractiveModel<
	ForbiddenModelView,
	ForbiddenModelInteraction
>;
