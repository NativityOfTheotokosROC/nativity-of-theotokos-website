import { ManageQuotesModel } from "@/src/lib/models/manage-quotes";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import QuoteHighlight from "./QuoteHighlight";
import { QuoteModelView } from "@/src/lib/models/quote";
import { useConfirmationDialog } from "@/src/lib/model-implementations/confirmation-dialog";
import { useScheduleQuoteModal } from "@/src/lib/model-implementations/schedule-quote-modal";
import { useWriteQuoteModal } from "@/src/lib/model-implementations/write-quote-modal";
import ConfirmationDialog from "../../confirmation-dialog/ConfirmationDialog";
import WriteQuoteModal from "../../write-quote-modal/WriteQuoteModal";
import ScheduleQuoteModal from "../../schedule-quote-modal/ScheduleQuoteModal";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { pickTranslation } from "@/src/lib/utilities/miscellaneous";
import {
	getDateString,
	getNativeTimeZone,
	pickDateTranslation,
} from "@/src/lib/utilities/date-time";
import MoreQuotes from "./MoreQuotes";
import ScheduledQuotes from "./ScheduledQuotes";
import { toZonedTime } from "date-fns-tz";

const ManageQuotes = function ({ model }) {
	const {
		modelView: { quotes, scheduledQuotes, autoCompleteInfo },
		interact,
	} = model;
	const t = useTranslations("manageQuotes");
	const locale = useLocale();
	const confirmationDialog = useConfirmationDialog();
	const writeQuoteModal = useWriteQuoteModal(async (newQuote, id) => {
		if (id !== undefined) {
			await interact({ type: "MODIFY_QUOTE", input: { id, newQuote } });
		} else {
			await interact({ type: "ADD_NEW_QUOTE", input: { newQuote } });
		}
	});
	const scheduleQuoteModal = useScheduleQuoteModal(
		async (quoteId, date, oldDate) => {
			if (oldDate) {
				await interact({
					type: "RESCHEDULE_QUOTE",
					input: { quoteId, newDate: date, oldDate },
				});
			} else {
				await interact({
					type: "SCHEDULE_QUOTE",
					input: { quoteId, date },
				});
			}
		},
	);
	const quoteModifiers = {
		editCallback(id) {
			const quote = quotes.find(quote => quote.id === id)!;
			writeQuoteModal.interact({
				type: "OPEN",
				input: { quote, autoCompleteInfo },
			});
		},
		scheduleCallback(id) {
			const quote = quotes.find(quote => quote.id === id)!;
			scheduleQuoteModal.interact({ type: "OPEN", input: { quote } });
		},
		deleteCallback(id) {
			const quote = quotes.find(quote => quote.id === id)!;
			confirmationDialog.interact({
				type: "OPEN",
				input: {
					message: t("confirmDeleteQuote", {
						author: pickTranslation(quote.author.name, locale),
					}),
					proceedCallback: async () =>
						await interact({
							type: "DELETE_QUOTE",
							input: { quoteId: quote.id },
						}),
				},
			});
		},
	} satisfies NonNullable<QuoteModelView["modifiers"]>;
	const quoteHighlight =
		scheduledQuotes.find(
			quote =>
				getDateString(quote.date, true) === getDateString(new Date()),
		) ?? quotes[0];

	return (
		<>
			<ConfirmationDialog model={confirmationDialog} />
			<WriteQuoteModal model={writeQuoteModal} />
			<ScheduleQuoteModal model={scheduleQuoteModal} />
			<div className="flex flex-col bg-[#FEF8F3] text-black">{quoteHighlight && (
				<QuoteHighlight
					model={newReadonlyModel({
						quote: quoteHighlight,
						modifiers: quoteModifiers,
					})}
				/>
			)}
			<MoreQuotes
				model={newReadonlyModel({
					quotes,
					quoteModifiers,
					newQuoteCallback: () =>
						writeQuoteModal.interact({ type: "OPEN" }),
				})}
			/>
			<ScheduledQuotes
				model={newReadonlyModel({
					quotes: scheduledQuotes,
					modifiers: {
						editCallback(id) {
							const quote = scheduledQuotes.find(
								quote => quote.id === id,
							)!;
							scheduleQuoteModal.interact({
								type: "OPEN",
								input: { quote },
							});
						},
						deleteCallback(id) {
							const quote = scheduledQuotes.find(
								quote => quote.id === id,
							)!;
							confirmationDialog.interact({
								type: "OPEN",
								input: {
									message: t("confirmDeleteScheduledQuote", {
										date: pickDateTranslation(
											toZonedTime(
												quote.date,
												getNativeTimeZone(),
											),
											locale,
										),
									}),
									proceedCallback: async () =>
										await interact({
											type: "DELETE_SCHEDULED_QUOTE",
											input: {
												date: getDateString(
													quote.date,
													true,
												),
											},
										}),
								},
							});
						},
					},
				})}
			/></div>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<ManageQuotesModel>>;

export default ManageQuotes;
