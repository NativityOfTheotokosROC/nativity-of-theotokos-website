"use client";

import { useSignOut } from "@/src/lib/model-implementations/sign-out";
import { Path } from "@/src/lib/types/general";
import { ModeledContainerComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import Spinner from "../spinner/Spinner";
import Button from "./Button";

const SignOutButton = function ({ model, children }) {
	const { signOutEndpoint } = model.modelView;
	const signOutModel = useSignOut(signOutEndpoint);
	const { signOutStatus } = signOutModel.modelView;

	return (
		<Button
			model={newReadonlyModel({
				variant: "standard",
				action: () =>
					signOutModel.interact({
						type: "SIGN_OUT",
						input: { hardNavigate: true }, // TODO: true until 310 error is solved
					}),
				disabled:
					signOutStatus?.type === "pending" ||
					signOutStatus?.type === "success",
				className: "flex justify-center items-center",
			})}
		>
			{signOutStatus?.type === "pending" ? (
				<Spinner
					model={newReadonlyModel({
						color: "white",
						size: 20,
					})}
				/>
			) : (
				children
			)}
		</Button>
	);
} satisfies ModeledContainerComponent<ReadonlyModel<{ signOutEndpoint: Path }>>;

export default SignOutButton;
