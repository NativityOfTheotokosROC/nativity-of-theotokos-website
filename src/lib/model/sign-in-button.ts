import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { SignInService } from "./sign-in";

export interface SignInButtonModelView {
	signInService: SignInService;
	isEnabled: boolean;
	isSelected: boolean;
}

export type SignInButtonModelInteraction = ModelInteraction<"SIGN_IN">;

export type SignInButtonModel = InteractiveModel<
	SignInButtonModelView,
	SignInButtonModelInteraction
>;
