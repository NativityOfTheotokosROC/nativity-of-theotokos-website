import { scrollToElement } from "@/src/lib/client-only/miscellaneous";
import { useConfirmationDialog } from "@/src/lib/model-implementations/confirmation-dialog";
import { useTabs } from "@/src/lib/model-implementations/tabs";
import { EditScheduleItemPanelModelView } from "@/src/lib/models/edit-schedule-item-panel";
import { NewScheduleEvent } from "@/src/lib/models/schedule-event";
import { SchedulerModel } from "@/src/lib/models/scheduler";
import { pickDateTranslation } from "@/src/lib/utilities/date-time";
import {
	parseCronPattern,
	pickTranslation,
} from "@/src/lib/utilities/miscellaneous";
import { pickScheduleItemTranslation } from "@/src/lib/utilities/schedule";
import { Language } from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { Calendar1Icon, RotateCcwIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import ButtonBar from "../../button-bar/ButtonBar";
import Button from "../../button/Button";
import ConfirmationDialog from "../../confirmation-dialog/ConfirmationDialog";
import PageView from "../../page-view/PageView";
import ScheduleEvent from "../../schedule-event/ScheduleEvent";
import Tabs from "../../tabs/Tabs";
import ScheduleSummarySection from "./ScheduleSummarySection";
import ViewScheduleSection from "./ViewScheduleSection";

const Scheduler = function ({ model }) {
	const { modelView, interact } = model;
	const {
		scheduleItems: {
			instantaneous: instantaneousScheduleItems,
			recurring: recurringScheduleItems,
		},
		autoCompleteInfo,
		eventToEdit,
	} = modelView;
	const t = useTranslations("scheduler");
	const locale = useLocale();
	const [viewScheduleLanguage, setViewScheduleLanguage] =
		useState<Language>(locale);
	const [readyEvent, setReadyEvent] = useState<
		NewScheduleEvent | undefined
	>();
	const tabs = useTabs({
		tabs: [
			{ modelView: { name: t("scheduleEventTab") } },
			{ modelView: { name: t("viewScheduleTab") } },
			{ modelView: { name: t("altScheduleSummaryTab") } },
		],
		tabsLayout: "fill",
		selectedTab: 1,
	});
	const confirmationDialog = useConfirmationDialog();
	const modifyCallbacks = {
		async editCallback(event) {
			await tabs.interact({ type: "SWITCH_TAB", input: { id: 0 } });
			scrollToElement(".schedule-event");
			switch (event.type) {
				case "specific": {
					const scheduleItem = instantaneousScheduleItems.find(
						scheduleItem =>
							scheduleItem.id === event.scheduleItem.id,
					)!;
					await interact({
						type: "UPDATE_EVENT_TO_EDIT",
						input: {
							event: {
								type: "specific",
								scheduleItem,
							},
						},
					});
					break;
				}
				case "recurring": {
					const scheduleItem = recurringScheduleItems.find(
						scheduleItem =>
							scheduleItem.id === event.scheduleItem.id,
					)!;
					await interact({
						type: "UPDATE_EVENT_TO_EDIT",
						input: {
							event: {
								type: "recurring",
								scheduleItem,
							},
						},
					});
					break;
				}
				case "recurringInstance": {
					const scheduleItem = recurringScheduleItems.find(
						scheduleItem =>
							scheduleItem.id ===
							event.scheduleItem.recurringItemId,
					)!;
					await interact({
						type: "UPDATE_EVENT_TO_EDIT",
						input: {
							event: {
								type: "specific",
								scheduleItem: {
									...scheduleItem,
									date: event.scheduleItem.date,
									isRemoved: scheduleItem.isDisabled,
									id: undefined,
								},
							},
						},
					});
					break;
				}
				default: {
					event satisfies never;
				}
			}
		},
		deleteCallback(event) {
			const proceedCallback = () =>
				interact({ type: "DELETE_EVENT", input: { event } });
			if (event.type === "specific") {
				const { title, date, venue } = instantaneousScheduleItems.find(
					scheduleItem => event.scheduleItem.id === scheduleItem.id,
				)!;
				confirmationDialog.interact({
					type: "OPEN",
					input: {
						message: t("confirmDeleteSpecific", {
							title: pickTranslation(title, locale),
							date: pickDateTranslation(date, locale),
							venue: pickTranslation(venue, locale),
						}),
						proceedCallback,
					},
				});
			} else {
				const { title, venue, recurringPattern } =
					recurringScheduleItems.find(
						scheduleItem =>
							event.scheduleItem.id === scheduleItem.id,
					)!;

				confirmationDialog.interact({
					type: "OPEN",
					input: {
						message: t("confirmDeleteRecurring", {
							title: pickTranslation(title, locale),
							venue: pickTranslation(venue, locale),
							parsedCron: parseCronPattern(
								recurringPattern,
								locale,
							),
						}),
						proceedCallback,
					},
				});
			}
		},
		toggleCallback(event) {
			const proceedCallback = () =>
				interact({ type: "TOGGLE_EVENT", input: { event } });
			switch (event.type) {
				case "specific": {
					const { title, date, venue } =
						instantaneousScheduleItems.find(
							scheduleItem =>
								event.scheduleItem.id === scheduleItem.id,
						)!;
					confirmationDialog.interact({
						type: "OPEN",
						input: {
							message: t(
								event.scheduleItem.isRemoved
									? "confirmEnableSpecific"
									: "confirmDisableSpecific",
								{
									title: pickTranslation(title, locale),
									date: pickDateTranslation(date, locale),
									venue: pickTranslation(venue, locale),
								},
							),
							proceedCallback,
						},
					});
					break;
				}
				case "recurring": {
					const { title, venue, recurringPattern } =
						recurringScheduleItems.find(
							scheduleItem =>
								event.scheduleItem.id === scheduleItem.id,
						)!;
					confirmationDialog.interact({
						type: "OPEN",
						input: {
							message: t(
								event.scheduleItem.isDisabled
									? "confirmEnableRecurring"
									: "confirmDisableRecurring",
								{
									title: pickTranslation(title, locale),
									venue: pickTranslation(venue, locale),
									parsedCron: parseCronPattern(
										recurringPattern,
										locale,
									),
								},
							),
							proceedCallback,
						},
					});
					break;
				}
				case "recurringInstance": {
					const { title, venue } = recurringScheduleItems.find(
						scheduleItem =>
							event.scheduleItem.recurringItemId ===
							scheduleItem.id,
					)!;
					confirmationDialog.interact({
						type: "OPEN",
						input: {
							message: t(
								event.scheduleItem.isRemoved
									? "confirmEnableSpecific"
									: "confirmDisableSpecific",
								{
									title: pickTranslation(title, locale),
									venue: pickTranslation(venue, locale),
									date: pickDateTranslation(
										event.scheduleItem.date,
										locale,
									),
								},
							),
							proceedCallback,
						},
					});
					break;
				}
			}
		},
	} satisfies EditScheduleItemPanelModelView["callbacks"];

	return (
		<>
			<ConfirmationDialog model={confirmationDialog} />
			<PageView model={newReadonlyModel({ title: t("title") })}>
				<div className="flex flex-col gap-12">
					<ButtonBar
						model={newReadonlyModel({
							orientation: "flexible",
							arrangement: "start",
							className: "max-w-fit",
						})}
					>
						<Button
							model={newReadonlyModel({
								className:
									"flex justify-start min-w-fit w-full md:w-fit max-w-full flex-1",
								async action() {
									await tabs.interact({
										type: "SWITCH_TAB",
										input: { id: 0 },
									});
									scrollToElement(".schedule-event");
									interact({
										type: "UPDATE_EVENT_TO_EDIT",
										input: {
											event: {
												type: "specific",
												scheduleItem: undefined,
											},
										},
									});
								},
							})}
						>
							<span className="inline-flex items-center gap-3">
								<Calendar1Icon
									className="size-5"
									strokeWidth={1.5}
								/>
								{t("scheduleSpecific")}
							</span>
						</Button>
						<Button
							model={newReadonlyModel({
								className:
									"flex min-w-fit justify-start w-full md:w-fit max-w-full flex-1",
								async action() {
									await tabs.interact({
										type: "SWITCH_TAB",
										input: { id: 0 },
									});
									scrollToElement(".schedule-event");
									interact({
										type: "UPDATE_EVENT_TO_EDIT",
										input: {
											event: {
												type: "recurring",
												scheduleItem: undefined,
											},
										},
									});
								},
							})}
						>
							<span className="inline-flex items-center gap-3">
								<RotateCcwIcon
									className="size-5"
									strokeWidth={1.5}
								/>
								{t("scheduleRecurring")}
							</span>
						</Button>
					</ButtonBar>
					<Tabs model={tabs}>
						<ScheduleEvent
							model={{
								modelView: {
									scheduleEvent: eventToEdit,
									autoCompleteInfo,
									options: {
										isNewEventValidCallback(
											newScheduleEvent,
										) {
											setReadyEvent(newScheduleEvent);
										},
										async previewCallback() {
											await tabs.interact({
												type: "SWITCH_TAB",
												input: { id: 1 },
											});
											scrollToElement(".view-schedule");
										},
									},
								},
								async interact(interaction) {
									switch (interaction.type) {
										case "SCHEDULE_EVENT": {
											const { newEvent, existingId } =
												interaction.input;
											await interact({
												type: "SCHEDULE_EVENT",
												input: {
													newEvent,
													id: existingId,
												},
											});
										}
									}
								},
							}}
						/>
						<ViewScheduleSection
							model={{
								modelView: {
									currentScheduleItems: {
										instantaneousScheduleItems,
										recurringScheduleItems,
									},
									newEvent: readyEvent,
									language: viewScheduleLanguage,
									modifyCallbacks,
								},
								interact(interaction) {
									switch (interaction.type) {
										case "SWITCH_LANGUAGE": {
											setViewScheduleLanguage(
												viewScheduleLanguage === "ru"
													? "en"
													: "ru",
											);
										}
									}
								},
							}}
						/>
						<ScheduleSummarySection
							model={newReadonlyModel({
								instantaneousScheduleItems:
									instantaneousScheduleItems.map(
										scheduleItem =>
											pickScheduleItemTranslation(
												scheduleItem,
												locale,
											),
									),
								recurringScheduleItems:
									recurringScheduleItems.map(scheduleItem =>
										pickScheduleItemTranslation(
											scheduleItem,
											locale,
										),
									),
								modifyCallbacks,
							})}
						/>
					</Tabs>
				</div>
			</PageView>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<SchedulerModel>>;

export default Scheduler;
