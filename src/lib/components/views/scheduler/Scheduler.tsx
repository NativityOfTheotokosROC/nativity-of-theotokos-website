import { useTabs } from "@/src/lib/model-implementations/tabs";
import { EditScheduleItemPanelModelView } from "@/src/lib/models/edit-schedule-item-panel";
import {
	ScheduleEventWithOptionalId,
	SchedulerModel,
} from "@/src/lib/models/scheduler";
import { getDateString } from "@/src/lib/utilities/date-time";
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

const Scheduler = function ({ model }) {
	const { modelView, interact } = model;
	const {
		scheduleItems: { instantaneousScheduleItems, recurringScheduleItems },
		autoCompleteInfo,
		eventToEdit,
	} = modelView;
	const t = useTranslations("scheduler");
	const locale = useLocale();
	const tabs = useTabs(
		[
			{ modelView: { name: t("scheduleEventTab") } },
			{ modelView: { name: t("viewScheduleTab") } },
			{ modelView: { name: t("altScheduleSummaryTab") } },
		],
		"center",
	);
	const modifyCallbacks = {
		async editCallback(event) {
			switch (event.type) {
				case "specific": {
					const scheduleItem = instantaneousScheduleItems.find(
						scheduleItem =>
							scheduleItem.id === event.scheduleItem.id,
					)!;
					return await interact({
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
					return await interact({
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
					return await interact({
						type: "UPDATE_EVENT_TO_EDIT",
						input: {
							event: {
								type: "specific",
								scheduleItem: {
									...scheduleItem,
									date: event.scheduleItem.date,
									isRemoved: false,
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
		deleteCallback(event) {},
		toggleCallback(event) {},
	} satisfies EditScheduleItemPanelModelView["callbacks"];
	const [viewScheduleLanguage, setViewScheduleLanguage] =
		useState<Language>(locale);
	const [readyEvent, setReadyEvent] = useState<
		ScheduleEventWithOptionalId | undefined
	>();

	// useEffect(() => {
	// 	setReadyEvent(eventToEdit.scheduleItem ? eventToEdit : undefined);
	// }, [eventToEdit]);

	return (
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
						action() {},
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
						action() {},
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
									if (newScheduleEvent) {
										const {
											scheduleItem: { times },
										} = newScheduleEvent;
										const parsedTimes = times.map(
											({ designation, time }) => ({
												designation,
												time: new Date(
													`${getDateString(new Date())}T${time}`,
												),
											}),
										);
										if (
											newScheduleEvent.type === "specific"
										) {
											setReadyEvent({
												...newScheduleEvent,
												scheduleItem: {
													...newScheduleEvent.scheduleItem,
													id: eventToEdit.scheduleItem
														?.id,
													isRemoved:
														"isRemoved" in
														eventToEdit.scheduleItem
															? eventToEdit
																	.scheduleItem
																	?.isRemoved
															: false,
													date: new Date(
														newScheduleEvent
															.scheduleItem.date,
													),
													times: parsedTimes,
												},
											});
										} else {
											setReadyEvent({
												...newScheduleEvent,
												scheduleItem: {
													...newScheduleEvent.scheduleItem,
													id: eventToEdit.scheduleItem
														?.id,
													isDisabled:
														"isDisabled" in
														eventToEdit.scheduleItem
															? eventToEdit
																	.scheduleItem
																	?.isDisabled
															: false,
													times: parsedTimes,
												},
											});
										}
									} else {
										setReadyEvent(undefined);
									}
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
											input: { newEvent: readyEvent },
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
							pendingScheduleItem: readyEvent?.scheduleItem,
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
	);
} satisfies ModeledVoidComponent<InitializedModel<SchedulerModel>>;

export default Scheduler;
