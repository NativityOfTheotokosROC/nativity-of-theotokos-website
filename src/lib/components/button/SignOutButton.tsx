"use client";

import { useRouter } from "@/src/i18n/navigation";
import { useSignOut } from "@/src/lib/model-implementations/sign-out";
import { Path } from "@/src/lib/types/general";
import { usePageLoadingBarRouter } from "@/src/lib/utilities/page-loading-bar";
import { ModeledContainerComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import Spinner from "../spinner/Spinner";
import Button from "./Button";

const SignOutButton = function ({ model, children }) {
	const { signOutEndpoint } = model.modelView;
	const router = usePageLoadingBarRouter(useRouter);
	const signOutModel = useSignOut(signOutEndpoint, router);
	const { signOutStatus } = signOutModel.modelView;

	return (
		<Button
			model={newReadonlyModel({
				variant: "standard",
				action: () => signOutModel.interact({ type: "SIGN_OUT" }),
				disabled:
					signOutStatus?.type === "pending" ||
					signOutStatus?.type === "success",
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
