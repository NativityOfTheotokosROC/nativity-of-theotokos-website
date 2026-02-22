import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { useTranslations } from "next-intl";
import {
	MailingListRepositoryModel,
	MailingListRepositoryModelInteraction,
	MailingListStatus,
} from "../model/mailing-list-repository";
import { subscribeToMailingList } from "../server-action/home";
import { notifierVIInterface } from "./notifier";

export function useMailingListRepository(): MailingListRepositoryModel {
	const notifier = useNewStatefulInteractiveModel(
		notifierVIInterface<MailingListStatus>(),
	);
	const t = useTranslations("mailingList");
	const successMessage = t("mailingListSuccessMessage");

	const mailingListRepository: MailingListRepositoryModel = {
		modelView: {
			mailingListStatus: notifier.modelView?.notification ?? null,
		},
		interact: async function (
			interaction: MailingListRepositoryModelInteraction,
		): Promise<void> {
			switch (interaction.type) {
				case "SUBSCRIBE": {
					await notifier.interact({
						type: "NOTIFY",
						input: {
							notification: { type: "pending" },
						},
					});
					await subscribeToMailingList(interaction.input.email)
						.then(() =>
							notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "subscribed",
										text: successMessage,
									},
								},
							}),
						)
						.catch(error => {
							notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "failed",
										message: t("errorMessage"),
									},
								},
							});
							console.error(error);
						});
				}
			}
		},
	};
	return mailingListRepository;
}
