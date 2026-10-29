import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	ManageQuotesModelView,
	ManageQuotesModelInteraction,
} from "../models/manage-quotes";
import { useRouter } from "next/navigation";
import { Translator } from "../utilities/types";
import { ToastNotifierModel } from "./notifier";
import {
	addDailyQuote,
	addNewQuote,
	deleteQuote,
	deleteScheduledQuote,
	rescheduleDailyQuote,
	updateQuote,
} from "../server-actions/quote";
import { UninitializedModelError } from "../utilities/errors";
import { useTranslations } from "next-intl";
import { getDateString } from "@/src/lib/utilities/date-time";

export function manageQuotesVIInterface(
	router: ReturnType<typeof useRouter>,
	notifications?: {
		notifier: ToastNotifierModel;
		t: Translator;
	},
) {
	return {
		async produceModelView(interaction, currentModelView) {
			if (!currentModelView) throw new UninitializedModelError();
			switch (interaction.type) {
				case "ADD_NEW_QUOTE": {
					const { newQuote } = interaction.input;
					try {
						const result = await addNewQuote(newQuote);
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notifications.t(
										"newQuote.successMessage",
									),
								},
							},
						});
						const { quotes, scheduledQuotes, autoCompleteInfo } =
							currentModelView;
						const { existingAuthors, existingSources } =
							autoCompleteInfo;
						const newQuotes = [...quotes, result];
						const newScheduledQuotesMap = newQuote.scheduledDate
							? new Map(
									[
										...scheduledQuotes,
										{
											...result,
											date: new Date(
												newQuote.scheduledDate,
											),
										},
									].map(
										scheduledQuote =>
											[
												getDateString(scheduledQuote.date),
												scheduledQuote,
											] as const,
									),
								)
							: null;
						const newAuthorsMap = new Map(
							[...existingAuthors, result.author.name].map(
								author => [author.english, author] as const,
							),
						);
						const newSourcesMap = result.source
							? new Map(
									[...existingSources, result.source].map(
										source =>
											[source.english, source] as const,
									),
								)
							: null;
						return {
							...currentModelView,
							autoCompleteInfo: {
								existingAuthors: newAuthorsMap
									.values()
									.toArray(),
								existingSources: newSourcesMap
									? newSourcesMap.values().toArray()
									: existingSources,
							},
							quotes: newQuotes,
							scheduledQuotes: newScheduledQuotesMap
								? newScheduledQuotesMap.values().toArray()
								: scheduledQuotes,
						};
					} catch (error) {
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: `${notifications.t(
										"newQuote.failureMessage",
									)} ${JSON.stringify(error)}`,
								},
							},
						});
						throw error;
					}
				}
				case "SCHEDULE_QUOTE": {
					const { quoteId, date } = interaction.input;
					try {
						await addDailyQuote(quoteId, date);
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notifications.t(
										"manageQuotes.scheduleSuccess",
									),
								},
							},
						});
						const { scheduledQuotes, quotes } = currentModelView;
						const newScheduledQuotesMap = new Map(
							[
								...scheduledQuotes,
								{
									...quotes.find(
										quote => quote.id === quoteId,
									)!,
									date: new Date(date),
								},
							].map(
								scheduledQuote =>
									[
										getDateString(scheduledQuote.date),
										scheduledQuote,
									] as const,
							),
						);
						return {
							...currentModelView,
							scheduledQuotes: newScheduledQuotesMap
								.values()
								.toArray(),
						};
					} catch (error) {
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: `${notifications.t(
										"manageQuotes.scheduleFailure",
									)} ${JSON.stringify(error)}`,
								},
							},
						});
						throw error;
					}
				}
				case "MODIFY_QUOTE": {
					const { id, newQuote } = interaction.input;
					try {
						const result = await updateQuote(id, newQuote);
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notifications.t(
										"manageQuotes.modifySuccess",
									),
								},
							},
						});
						const { quotes, scheduledQuotes, autoCompleteInfo } =
							currentModelView;
						const { existingAuthors, existingSources } =
							autoCompleteInfo;
						const newQuotes = [
							...quotes.filter(quote => !(quote.id === id)),
							result,
						];
						const newScheduledQuotesMap = newQuote.scheduledDate
							? new Map(
									[
										...scheduledQuotes,
										{
											...result,
											date: new Date(
												newQuote.scheduledDate,
											),
										},
									].map(
										scheduledQuote =>
											[
												getDateString(scheduledQuote.date),
												scheduledQuote,
											] as const,
									),
								)
							: null;
						const newAuthorsMap = new Map(
							[...existingAuthors, result.author.name].map(
								author => [author.english, author] as const,
							),
						);
						const newSourcesMap = result.source
							? new Map(
									[...existingSources, result.source].map(
										source =>
											[source.english, source] as const,
									),
								)
							: null;
						return {
							...currentModelView,
							autoCompleteInfo: {
								existingAuthors: newAuthorsMap
									.values()
									.toArray(),
								existingSources: newSourcesMap
									? newSourcesMap.values().toArray()
									: existingSources,
							},
							quotes: newQuotes,
							scheduledQuotes: newScheduledQuotesMap
								? newScheduledQuotesMap.values().toArray()
								: scheduledQuotes,
						};
					} catch (error) {
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: `${notifications.t(
										"manageQuotes.modifyFailure",
									)} ${JSON.stringify(error)}`,
								},
							},
						});
						throw error;
					}
				}
				case "RESCHEDULE_QUOTE": {
					const { quoteId, oldDate, newDate } = interaction.input;
					try {
						await rescheduleDailyQuote(quoteId, oldDate, newDate);
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notifications.t(
										"manageQuotes.rescheduleSuccess",
									),
								},
							},
						});
						const { scheduledQuotes, quotes } = currentModelView;
						const newScheduledQuotesMap = new Map(
							[
								...scheduledQuotes.filter(
									quote =>
										!(
											quote.date === new Date(oldDate) &&
											quote.id === quoteId
										),
								),
								{
									...quotes.find(
										quote => quote.id === quoteId,
									)!,
									date: new Date(newDate),
								},
							].map(
								scheduledQuote =>
									[
										getDateString(scheduledQuote.date),
										scheduledQuote,
									] as const,
							),
						);
						return {
							...currentModelView,
							scheduledQuotes: newScheduledQuotesMap
								.values()
								.toArray(),
						};
					} catch (error) {
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: `${notifications.t(
										"manageQuotes.scheduleFailure",
									)} ${JSON.stringify(error)}`,
								},
							},
						});
						throw error;
					}
				}
				case "DELETE_QUOTE": {
					const { quoteId } = interaction.input;
					try {
						await deleteQuote(quoteId);
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notifications.t(
										"manageQuotes.deleteSuccess",
									),
								},
							},
						});
						const { scheduledQuotes, quotes } = currentModelView;
						return {
							...currentModelView,
							quotes: quotes.filter(
								quote => !(quote.id === quoteId),
							),
							scheduledQuotes: scheduledQuotes.filter(
								quote => !(quote.id === quoteId),
							),
						};
					} catch (error) {
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: `${notifications.t(
										"manageQuotes.deleteFailure",
									)} ${JSON.stringify(error)}`,
								},
							},
						});
						throw error;
					}
				}
				case "DELETE_SCHEDULED_QUOTE": {
					const { date } = interaction.input;
					try {
						await deleteScheduledQuote(date);
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "success",
									message: notifications.t(
										"manageQuotes.deleteScheduledSuccess",
									),
								},
							},
						});
						const { scheduledQuotes } = currentModelView;
						return {
							...currentModelView,
							scheduledQuotes: scheduledQuotes.filter(
								quote => !(getDateString(quote.date) === date),
							),
						};
					} catch (error) {
						await notifications?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: `${notifications.t(
										"manageQuotes.deleteScheduleFailure",
									)} ${JSON.stringify(error)}`,
								},
							},
						});
						throw error;
					}
				}
			}
		},
	} satisfies ViewInteractionInterface<
		ManageQuotesModelView,
		ManageQuotesModelInteraction
	>;
}

export function useManageQuotes(
	initialModelView: ManageQuotesModelView,
	notifier?: ToastNotifierModel,
) {
	const t = useTranslations();
	const router = useRouter();
	const model = useInitializedStatefulInteractiveModel(
		manageQuotesVIInterface(router, notifier ? { notifier, t } : undefined),
		initialModelView,
	);
	return model;
}
