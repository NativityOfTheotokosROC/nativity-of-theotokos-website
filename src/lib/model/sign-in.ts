import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../type/miscellaneous";

export type SignInService = "google" | "yandex";
export type SignInStatus =
	| (Notification<"success" | "failed"> & { message: string })
	| (Notification<"pending"> & { service?: SignInService });

export interface SignInModelView {
	signInServices: SignInService[];
	signInStatus: SignInStatus | null;
	selectedService: SignInService | null;
}

export type SignInModelInteraction = InputModelInteraction<
	"SIGN_IN",
	{ signInService: SignInService }
>;

export type SignInModel = InteractiveModel<
	SignInModelView,
	SignInModelInteraction
>;
