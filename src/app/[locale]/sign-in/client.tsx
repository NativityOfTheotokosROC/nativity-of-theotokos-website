"use client";

import { useSignIn } from "@/src/lib/model-implementation/sign-in";
import { SignInClientModel } from "@/src/lib/model/sign-in-client";
import { ModeledVoidComponent } from "@mvc-react/components";
import SignIn from "./SignIn";
import { useSearchParams } from "next/navigation";

const SignInClient = function ({ model }) {
	const { signInServices } = model.modelView;
	const searchParams = useSearchParams();
	const endpoint = searchParams.get("endpoint");

	const signIn = useSignIn(
		endpoint != undefined ? endpoint : "",
		signInServices,
	);

	return <SignIn model={signIn} />;
} satisfies ModeledVoidComponent<SignInClientModel>;

export default SignInClient;
