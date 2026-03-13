import { ReadonlyModel } from "@mvc-react/mvc";
import { SignInService } from "./sign-in";

export interface SignInClientModelView {
	signInEndpoint: string;
	signInServices: SignInService[];
}

export type SignInClientModel = ReadonlyModel<SignInClientModelView>;
