"use client";

import { useSignIn } from "@/src/lib/model-implementations/sign-in";
import { SignInClientModel } from "@/src/lib/models/sign-in-client";
import { ModeledVoidComponent } from "@mvc-react/components";
import SignIn from "./SignIn";

const SignInClient = function ({ model }) {
	const { signInServices, signInEndpoint } = model.modelView;

	const signIn = useSignIn(signInEndpoint, signInServices);

	return <SignIn model={signIn} />;
} satisfies ModeledVoidComponent<SignInClientModel>;

export default SignInClient;
