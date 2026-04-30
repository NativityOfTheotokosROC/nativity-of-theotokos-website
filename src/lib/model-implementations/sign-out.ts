import { InitializedModel } from "@mvc-react/mvc";
import { SignOutModel, SignOutStatus } from "../models/sign-out";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { notifierVIInterface } from "./notifier";
import { useRouter } from "next/navigation";
import { signOut } from "../third-party/better-auth";
import { createToast } from "../components/miscellaneous/utility";
import { useQueryClient } from "@tanstack/react-query";
import { refreshUserInformation } from "../utilities/user";
import { useCookies } from "react-cookie";

export function useSignOut(
	signOutEndpoint: `/${string}`,
	router: ReturnType<typeof useRouter>,
) {
	const queryClient = useQueryClient();
	const notifier = useNewStatefulInteractiveModel(
		notifierVIInterface<SignOutStatus>(),
	);
	const removeCookie = useCookies<"tooltipShown", { tooltipShown: boolean }>([
		"tooltipShown",
	])[2];

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
					removeCookie("tooltipShown");
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: { type: "success" },
						},
					});
					if (interaction.input.hardRefresh) {
						window.open(signOutEndpoint, "_self");
						break;
					}
					router.push(signOutEndpoint);
					router.refresh();
					break;
				}
			}
		},
	} satisfies InitializedModel<SignOutModel>;
}
