import { useTabs } from "@/src/lib/model-implementations/tabs";
import { EditScheduleItemPanelModelView } from "@/src/lib/models/edit-schedule-item-panel";
import { NewScheduleEvent } from "@/src/lib/models/schedule-event";
import { SchedulerModel } from "@/src/lib/models/scheduler";
import { pickScheduleItemTranslation } from "@/src/lib/utilities/schedule";
import { Language } from "@/src/lib/utilities/types";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { ArrowRightIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import ButtonBar from "../../button-bar/ButtonBar";
import Button from "../../button/Button";
import PageView from "../../page-view/PageView";
import Tabs from "../../tabs/Tabs";
import ScheduleEventSection from "./ScheduleEventSection";
import ScheduleSummarySection from "./ScheduleSummarySection";
import ViewScheduleSection from "./ViewScheduleSection";
import ConfirmationDialog from "../../confirmation-dialog/ConfirmationDialog";
import { useConfirmationDialog } from "@/src/lib/model-implementations/confirmation-dialog";
import { pickTranslation } from "@/src/lib/utilities/miscellaneous";
import { pickDateTranslation } from "@/src/lib/utilities/date-time";

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
	const tabs = useTabs(
		[
			{ modelView: { name: t("scheduleEventTab") } },
			{ modelView: { name: t("viewScheduleTab") } },
			{ modelView: { name: t("altScheduleSummaryTab") } },
		],
		"center",
		1,
	);
	const confirmationDialog = useConfirmationDialog();
	const modifyCallbacks = {
		editCallback(event) {
			switch (event.type) {
				case "specific": {
					const scheduleItem = instantaneousScheduleItems.find(
						scheduleItem =>
							scheduleItem.id === event.scheduleItem.id,
					)!;
					return interact({
						type: "UPDATE_EVENT_TO_EDIT",
						input: {
							event: {
								type: "specific",
								scheduleItem,
							},
						},
					});
				}
				case "recurring": {
					const scheduleItem = recurringScheduleItems.find(
						scheduleItem =>
							scheduleItem.id === event.scheduleItem.id,
					)!;
					return interact({
						type: "UPDATE_EVENT_TO_EDIT",
						input: {
							event: {
								type: "recurring",
								scheduleItem,
							},
						},
					});
				}
				case "recurringInstance": {
					const scheduleItem = recurringScheduleItems.find(
						scheduleItem =>
							scheduleItem.id ===
							event.scheduleItem.recurringItemId,
					)!;
					return interact({
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
				const { title, date } = instantaneousScheduleItems.find(
					scheduleItem => event.scheduleItem.id === scheduleItem.id,
				)!;
				confirmationDialog.interact({
					type: "OPEN",
					input: {
						message: t("confirmDeleteSpecific", {
							title: pickTranslation(title, locale),
							date: pickDateTranslation(date, locale),
						}),
						proceedCallback,
					},
				});
			} else {
				const { title } = instantaneousScheduleItems.find(
					scheduleItem => event.scheduleItem.id === scheduleItem.id,
				)!;
				confirmationDialog.interact({
					type: "OPEN",
					input: {
						message: t("confirmDeleteRecurring", {
							title: pickTranslation(title, locale),
						}),
						proceedCallback,
					},
				});
			}
		},
		toggleCallback(event) {
			interact({ type: "TOGGLE_EVENT", input: { event } });
		},
	} satisfies EditScheduleItemPanelModelView["callbacks"];

	return (
		<>
			<ConfirmationDialog model={confirmationDialog} />
			<PageView model={newReadonlyModel({ title: t("title") })}>
				<ButtonBar
					model={newReadonlyModel({
						orientation: "vertical",
						arrangement: "start",
					})}
				>
					<Button
						model={newReadonlyModel({
							variant: "alternative",
							action() {
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
						<span className="inline-flex gap-1">
							<ArrowRightIcon strokeWidth={1} />
							{t("scheduleSpecific")}
						</span>
					</Button>
					<Button
						model={newReadonlyModel({
							variant: "alternative",
							action() {
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
						<span className="inline-flex gap-1">
							<ArrowRightIcon strokeWidth={1} />
							{t("scheduleRecurring")}
						</span>
					</Button>
				</ButtonBar>
				<Tabs model={tabs}>
					<ScheduleEventSection
						model={{
							modelView: {
								scheduleEvent: eventToEdit,
								autoCompleteInfo,
								options: {
									isNewEventValidCallback(newScheduleEvent) {
										setReadyEvent(newScheduleEvent);
									},
									previewCallback() {
										tabs.interact({
											type: "SWITCH_TAB",
											input: { id: 1 },
										});
									},
								},
							},
							async interact(interaction) {
								switch (interaction.type) {
									case "SCHEDULE_EVENT":
										if (readyEvent)
											await interact({
												type: "SCHEDULE_EVENT",
												input: {
													id: eventToEdit.scheduleItem
														?.id,
													newEvent: readyEvent,
												},
											});
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
								instantaneousScheduleItems.map(scheduleItem =>
									pickScheduleItemTranslation(
										scheduleItem,
										locale,
									),
								),
							recurringScheduleItems: recurringScheduleItems.map(
								scheduleItem =>
									pickScheduleItemTranslation(
										scheduleItem,
										locale,
									),
							),
							modifyCallbacks,
						})}
					/>
				</Tabs>
			</PageView>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<SchedulerModel>>;

export default Scheduler;
