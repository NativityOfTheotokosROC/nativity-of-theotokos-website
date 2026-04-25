import { InitializedModel } from "@mvc-react/mvc";
import { SignOutModel, SignOutStatus } from "../models/sign-out";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { notifierVIInterface } from "./notifier";
import { useRouter } from "next/navigation";
import { signOut } from "../third-party/better-auth";
import { createToast } from "../components/miscellaneous/utility";
import { useQueryClient } from "@tanstack/react-query";
import { refreshUserInformation } from "../utilities/user";

export function useSignOut(
	signOutEndpoint: `/${string}`,
	router: ReturnType<typeof useRouter>,
) {
	const queryClient = useQueryClient();
	const notifier = useNewStatefulInteractiveModel(
		notifierVIInterface<SignOutStatus>(),
	);

	return {
		modelView: { signOutStatus: notifier.modelView?.notification ?? null },
		async interact(interaction) {
			switch (interaction.type) {
				case "SIGN_OUT": {
					await notifier.interact({
						type: "NOTIFY",
						input: { notification: { type: "pending" } },
					});
					const response = await signOut();
					if (response.error) {
						const message =
							response.error.message ?? response.error.statusText;
						createToast({ type: "failure", message }); // TODO: Move this out in the future
						await notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failed",
									message,
								},
							},
						});
						return;
					}
					await refreshUserInformation(queryClient);
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: { type: "success" },
						},
					});
					router.push(signOutEndpoint);
					router.refresh();
					break;
				}
			}
		},
	} satisfies InitializedModel<SignOutModel>;
}
