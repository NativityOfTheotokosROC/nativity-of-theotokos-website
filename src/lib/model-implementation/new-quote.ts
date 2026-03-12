import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import {
	NewQuoteModel,
	NewQuoteModelInteraction,
	NewQuoteNotification,
} from "../model/new-quote";
import { addNewQuote } from "../server-action/quote";
import { notifierVIInterface } from "./notifier";
import { InitializedModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";

export function useNewQuote(quoteCharacterLimit: number) {
	const notifier = useNewStatefulInteractiveModel(
		notifierVIInterface<NewQuoteNotification>(),
	);
	const t = useTranslations("newQuote");

	return {
		modelView: {
			newQuoteNotification: notifier.modelView?.notification ?? null,
			quoteCharacterLimit,
		},
		interact: async function (interaction: NewQuoteModelInteraction) {
			switch (interaction.type) {
				case "ADD_QUOTE": {
					await notifier
						.interact({
							type: "NOTIFY",
							input: {
								notification: { type: "pending" },
							},
						})
						.then(() =>
							addNewQuote(interaction.input)
								.then(() =>
									notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "success",
												text: t("successMessage"),
											},
										},
									}),
								)
								.catch(reason =>
									notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "failure",
												message: `${t("failureMessage")} ${reason} `,
											},
										},
									}),
								),
						);
				}
			}
		},
	} satisfies InitializedModel<NewQuoteModel>;
}
