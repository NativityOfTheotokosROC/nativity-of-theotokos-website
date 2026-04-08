"use client";

import { useSignOut } from "@/src/lib/model-implementation/sign-out";
import { usePageLoadingBarRouter } from "@/src/lib/utility/page-loading-bar";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { ReactNode } from "react";
import Spinner from "../../spinner/Spinner";
import { useRouter } from "@/src/i18n/navigation";
import { Path } from "@/src/lib/type/general";

const SignOutButton = function ({ model }) {
	const { buttonContent, signOutEndpoint } = model.modelView;
	const router = usePageLoadingBarRouter(useRouter);
	const signOutModel = useSignOut(signOutEndpoint, router);
	const { signOutStatus } = signOutModel.modelView;

	return (
		<button
			className="flex w-30 items-center justify-center rounded-lg bg-[#250203]/82 p-4 text-white hover:bg-[#250203]/92 active:bg-[#250203] disabled:opacity-72"
			onClick={() => {
				signOutModel.interact({ type: "SIGN_OUT" });
			}}
			disabled={
				signOutStatus?.type == "pending" ||
				signOutStatus?.type == "success"
			}
		>
			{signOutStatus?.type == "pending" ? (
				<Spinner
					model={newReadonlyModel({
						color: "white",
						size: 20,
					})}
				/>
			) : (
				buttonContent
			)}
		</button>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{ buttonContent: ReactNode; signOutEndpoint: Path }>
>;

export default SignOutButton;
