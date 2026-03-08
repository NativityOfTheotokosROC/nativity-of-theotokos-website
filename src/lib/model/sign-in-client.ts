import { ReadonlyModel } from "@mvc-react/mvc";
import { SignInService } from "./sign-in";

export interface SignInClientModelView {
	signInServices: SignInService[];
}

export type SignInClientModel = ReadonlyModel<SignInClientModelView>;
