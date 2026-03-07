import { InitializedModel } from "@mvc-react/mvc";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { useRouter } from "next/navigation";
import { ForbiddenModel, SignOutStatus } from "../model/forbidden";
import { signOut } from "../third-party/better-auth";
import { notifierVIInterface } from "./notifier";

export function useForbidden(
	router: ReturnType<typeof useRouter>,
	signOutPath?: `/${string}`,
) {
	const notifier = useNewStatefulInteractiveModel(
		notifierVIInterface<SignOutStatus>(),
	);

	return {
		modelView: { signOutStatus: notifier.modelView?.notification ?? null },
		async interact(interaction) {
			switch (interaction.type) {
				case "GO_HOME": {
					router.push("/");
					break;
				}
				case "SIGN_OUT": {
					await signOut().then(async response => {
						if (response.error)
							return notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "failed",
										message:
											response.error.message ??
											response.error.statusText,
									},
								},
							});
						// TODO: Tweak mvc-react
						await notifier.interact({
							type: "NOTIFY",
							input: { notification: { type: "success" } },
						});
						router.push(signOutPath ?? "/");
					});
					break;
				}
			}
		},
	} satisfies InitializedModel<ForbiddenModel>;
}
