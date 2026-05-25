import { InitializedModel } from "@mvc-react/mvc";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { createToast } from "../components/miscellaneous/utility";
import { PageLoadingBarContext } from "../components/page-loading-bar/PageLoadingBar";
import {
	NotifierModelInteraction,
	NotifierModelView,
} from "../models/notifier";
import { SignOutModel, SignOutStatus } from "../models/sign-out";
import { signOut } from "../third-party/better-auth";
import { refreshUserInformation } from "../utilities/user";
import { LOGIN_TOOLTIP_COOKIE_NAME } from "./login-tooltip";

export function useSignOut(signOutEndpoint: `/${string}`) {
	const queryClient = useQueryClient();
	const pageLoadingBar = useContext(PageLoadingBarContext);
	const router = useRouter();
	const notifier = useNewStatefulInteractiveModel<
		NotifierModelView<SignOutStatus>,
		NotifierModelInteraction<SignOutStatus>
	>({
		produceModelView: async function (
			interaction: NotifierModelInteraction<SignOutStatus>,
		): Promise<NotifierModelView<SignOutStatus, unknown>> {
			switch (interaction.type) {
				case "NOTIFY": {
					if (interaction.input.notification.type == "pending")
						await pageLoadingBar.interact({
							type: "SET_LOADING",
							input: { value: true },
						});
					if (interaction.input.notification.type == "failed")
						await pageLoadingBar.interact({
							type: "SET_LOADING",
							input: { value: false },
						});
					return { notification: interaction.input.notification };
				}
			}
		},
	});

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
					await window.cookieStore.delete(LOGIN_TOOLTIP_COOKIE_NAME);
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: { type: "success" },
						},
					});
					if (interaction.input.hardNavigate) {
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
