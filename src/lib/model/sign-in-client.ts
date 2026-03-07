import { ReadonlyModel } from "@mvc-react/mvc";
import { SignInService } from "./sign-in";

export interface SignInClientModelView {
	endpoint: string;
	signInServices: SignInService[];
}

export type SignInClientModel = ReadonlyModel<SignInClientModelView>;
