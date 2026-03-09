import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { notifierVIInterface } from "./notifier";
import {
	SignInModel,
	SignInModelInteraction,
	SignInService,
	SignInStatus,
} from "../model/sign-in";
import { signIn } from "../third-party/better-auth";
import { ErrorContext } from "better-auth/react";
import { useTranslations } from "next-intl";

export function useSignIn(endpoint: string, signInServices: SignInService[]) {
	const notifier = useNewStatefulInteractiveModel(
		notifierVIInterface<SignInStatus>(),
	);
	const t = useTranslations("signIn");

	return {
		modelView: {
			signInServices,
			signInStatus: notifier.modelView?.notification ?? null,
		},
		interact: async function (interaction: SignInModelInteraction) {
			switch (interaction.type) {
				case "SIGN_IN": {
					const { signInService } = interaction.input;
					const callbacks = (serviceName: string) => ({
						onRequest: async () => {
							await notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "pending",
										service: signInService,
									},
								},
							});
						},
						onSuccess: async () => {
							await notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "success",
										message: t("successMessage", {
											serviceName: serviceName,
										}),
									},
								},
							});
						},
						onError: async (context: ErrorContext) => {
							await notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "failed",
										message: `${t("failureMessage", { serviceName: serviceName })} ${context.error.message}`,
									},
								},
							});
						},
					});
					switch (signInService) {
						case "google": {
							await signIn.social(
								{
									provider: "google",
									callbackURL: `/${endpoint}`,
								},
								callbacks("Google"),
							);
							break;
						}
						case "yandex": {
							await signIn.oauth2(
								{
									providerId: "yandex",
									callbackURL: `/${endpoint}`,
								},
								callbacks("Yandex"),
							);
							break;
						}
					}
				}
			}
		},
	} satisfies SignInModel;
}
