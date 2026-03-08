"use client";

import { useSignIn } from "@/src/lib/model-implementation/sign-in";
import { SignInClientModel } from "@/src/lib/model/sign-in-client";
import { ModeledVoidComponent } from "@mvc-react/components";
import SignIn from "./SignIn";

const SignInClient = function ({ model }) {
	const { endpoint, signInServices } = model.modelView;
	const signIn = useSignIn(endpoint, signInServices);

	return <SignIn model={signIn} />;
} satisfies ModeledVoidComponent<SignInClientModel>;

export default SignInClient;
