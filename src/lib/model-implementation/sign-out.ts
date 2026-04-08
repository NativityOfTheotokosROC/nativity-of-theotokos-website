import { InitializedModel } from "@mvc-react/mvc";
import { SignOutModel, SignOutStatus } from "../model/sign-out";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { notifierVIInterface } from "./notifier";
import { useRouter } from "next/navigation";
import { signOut } from "../third-party/better-auth";
import { createToast } from "../component/miscellaneous/utility";

export function useSignOut(
	signOutEndpoint: `/${string}`,
	router: ReturnType<typeof useRouter>,
) {
	const notifier = useNewStatefulInteractiveModel(
		notifierVIInterface<SignOutStatus>(),
	);

	return {
		modelView: { signOutStatus: notifier.modelView?.notification ?? null },
		async interact(interaction) {
			switch (interaction.type) {
				case "SIGN_OUT": {
					await notifier
						.interact({
							type: "NOTIFY",
							input: { notification: { type: "pending" } },
						})
						.then(() => signOut())
						.then(async response => {
							if (response.error) {
								const message =
									response.error.message ??
									response.error.statusText;
								createToast({ type: "failure", message }); // TODO: Move this out in the future
								return notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "failed",
											message,
										},
									},
								});
							}
							await notifier.interact({
								type: "NOTIFY",
								input: {
									notification: { type: "success" },
								},
							});
							router.push(signOutEndpoint);
							router.refresh();
						});
					break;
				}
			}
		},
	} satisfies InitializedModel<SignOutModel>;
}
