import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import { useTranslations } from "next-intl";
import {
	SchedulerModelInteraction,
	SchedulerModelView,
} from "../models/scheduler";
import {
	deleteInstantaneousScheduleItem,
	deleteRecurringScheduleItem,
	removeInstantaneousItem,
	restoreInstantaneousItem,
	scheduleInstantaneousItem,
	scheduleRecurringItem,
	toggleRecurringItem,
	updateInstantaneousItem,
	updateRecurringItem,
} from "../server-actions/schedule";
import { getDateString } from "../utilities/date-time";
import { UninitializedModelError } from "../utilities/errors";
import { parseNewScheduleItemWithId } from "../utilities/schedule";
import { Translator } from "../utilities/types";
import { ToastNotifierModel } from "./notifier";

export function schedulerVIInterface(notification?: {
	notifier: ToastNotifierModel;
	t: Translator;
}) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "SCHEDULE_EVENT":
					if (!currentModelView) throw new UninitializedModelError();
					const { id, newEvent } = interaction.input;
					switch (newEvent.type) {
						case "specific": {
							const {
								instantaneous: instantaneousScheduleItems,
							} = currentModelView.scheduleItems;
							let newInstantaneousScheduleItems =
								instantaneousScheduleItems;
							if (id !== undefined) {
								try {
									await updateInstantaneousItem(
										id,
										newEvent.scheduleItem,
									);
									await notification?.notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "success",
												message: notification.t(
													"scheduler.modifySuccess",
												),
											},
										},
									});
									newInstantaneousScheduleItems = [
										...instantaneousScheduleItems.filter(
											scheduleItem =>
												scheduleItem.id !== id,
										),
										parseNewScheduleItemWithId(
											newEvent.scheduleItem,
											id,
										),
									];
								} catch (error) {
									await notification?.notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "failure",
												message: notification.t(
													"scheduler.modifyFailure",
													{
														message:
															JSON.stringify(
																error,
															),
													},
												),
											},
										},
									});
									throw error;
								}
							} else {
								try {
									const newScheduleItem =
										await scheduleInstantaneousItem(
											newEvent.scheduleItem,
										);
									await notification?.notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "success",
												message: notification.t(
													"scheduler.scheduleSuccess",
												),
											},
										},
									});
									newInstantaneousScheduleItems = [
										...instantaneousScheduleItems,
										newScheduleItem,
									];
								} catch (error) {
									await notification?.notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "failure",
												message: notification.t(
													"scheduler.scheduleFailure",
													{
														message:
															JSON.stringify(
																error,
															),
													},
												),
											},
										},
									});
									throw error;
								}
							}
							return {
								...currentModelView,
								scheduleItems: {
									...currentModelView.scheduleItems,
									instantaneous:
										newInstantaneousScheduleItems,
								},
								eventToEdit: { type: newEvent.type },
							};
						}
						case "recurring": {
							const { recurring: recurringScheduleItems } =
								currentModelView.scheduleItems;
							let newRecurringScheduleItems =
								recurringScheduleItems;
							if (id !== undefined) {
								try {
									await updateRecurringItem(
										id,
										newEvent.scheduleItem,
									);
									await notification?.notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "success",
												message: notification.t(
													"scheduler.modifySuccess",
												),
											},
										},
									});
									newRecurringScheduleItems = [
										...recurringScheduleItems.filter(
											scheduleItem =>
												scheduleItem.id !== id,
										),
										parseNewScheduleItemWithId(
											newEvent.scheduleItem,
											id,
										),
									];
								} catch (error) {
									await notification?.notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "failure",
												message: notification.t(
													"scheduler.modifyFailure",
													{
														message:
															JSON.stringify(
																error,
															),
													},
												),
											},
										},
									});
									throw error;
								}
							} else {
								try {
									const newScheduleItem =
										await scheduleRecurringItem(
											newEvent.scheduleItem,
										);
									await notification?.notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "success",
												message: notification.t(
													"scheduler.scheduleSuccess",
												),
											},
										},
									});
									newRecurringScheduleItems = [
										...recurringScheduleItems,
										newScheduleItem,
									];
								} catch (error) {
									await notification?.notifier.interact({
										type: "NOTIFY",
										input: {
											notification: {
												type: "failure",
												message: notification.t(
													"scheduler.scheduleFailure",
													{
														message:
															JSON.stringify(
																error,
															),
													},
												),
											},
										},
									});
									throw error;
								}
							}
							return {
								...currentModelView,
								scheduleItems: {
									...currentModelView.scheduleItems,
									recurring: newRecurringScheduleItems,
								},
								eventToEdit: { type: newEvent.type },
							};
						}
					}
				case "UPDATE_EVENT_TO_EDIT": {
					if (!currentModelView) throw new UninitializedModelError();
					return {
						...currentModelView,
						eventToEdit: interaction.input.event,
					};
				}
				case "TOGGLE_EVENT": {
					if (!currentModelView) throw new UninitializedModelError();
					const { event } = interaction.input;
					try {
						switch (event.type) {
							case "specific": {
								if (event.scheduleItem.isRemoved) {
									await restoreInstantaneousItem(
										event.scheduleItem.id,
									);
								} else {
									await removeInstantaneousItem(
										event.scheduleItem.id,
									);
								}
								await notification?.notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "success",
											message: notification.t(
												"scheduler.modifySuccess",
											),
										},
									},
								});
								const instantaneousScheduleItems =
									currentModelView.scheduleItems
										.instantaneous;
								const newInstantaneousScheduleItems = [
									{
										...instantaneousScheduleItems.find(
											scheduleItem =>
												scheduleItem.id ===
												event.scheduleItem.id,
										)!,
										isRemoved:
											!event.scheduleItem.isRemoved,
									},
									...instantaneousScheduleItems.filter(
										scheduleItem =>
											scheduleItem.id !==
											event.scheduleItem.id,
									),
								];

								return {
									...currentModelView,
									scheduleItems: {
										...currentModelView.scheduleItems,
										instantaneous:
											newInstantaneousScheduleItems,
									},
								};
							}
							case "recurring": {
								await toggleRecurringItem(
									event.scheduleItem.id,
									!event.scheduleItem.isDisabled,
								);
								await notification?.notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "success",
											message: notification.t(
												"scheduler.modifySuccess",
											),
										},
									},
								});
								const recurringScheduleItems =
									currentModelView.scheduleItems.recurring;
								const newRecurringScheduleItems = [
									{
										...recurringScheduleItems.find(
											scheduleItem =>
												scheduleItem.id ===
												event.scheduleItem.id,
										)!,
										isDisabled:
											!event.scheduleItem.isDisabled,
									},
									...recurringScheduleItems.filter(
										scheduleItem =>
											scheduleItem.id !==
											event.scheduleItem.id,
									),
								];
								return {
									...currentModelView,
									scheduleItems: {
										...currentModelView.scheduleItems,
										recurring: newRecurringScheduleItems,
									},
								};
							}
							case "recurringInstance": {
								const recurringScheduleItem =
									currentModelView.scheduleItems.recurring.find(
										scheduleItem =>
											scheduleItem.id ===
											event.scheduleItem.recurringItemId,
									)!;
								const newScheduleItem =
									await scheduleInstantaneousItem({
										...recurringScheduleItem,
										date: getDateString(
											event.scheduleItem.date,
											true,
										),
										isRemoved:
											!event.scheduleItem.isRemoved,
									});
								await notification?.notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "success",
											message: notification.t(
												"scheduler.modifySuccess",
											),
										},
									},
								});
								const newInstantaneousScheduleItems = [
									...currentModelView.scheduleItems
										.instantaneous,
									newScheduleItem,
								];
								return {
									...currentModelView,
									scheduleItems: {
										...currentModelView.scheduleItems,
										instantaneous:
											newInstantaneousScheduleItems,
									},
								};
							}
						}
					} catch (error) {
						await notification?.notifier.interact({
							type: "NOTIFY",
							input: {
								notification: {
									type: "failure",
									message: notification.t(
										"scheduler.modifyFailure",
										{
											message: JSON.stringify(error),
										},
									),
								},
							},
						});
						throw error;
					}
				}
				case "DELETE_EVENT": {
					if (!currentModelView) throw new UninitializedModelError();
					const { event } = interaction.input;
					switch (event.type) {
						case "specific": {
							try {
								await deleteInstantaneousScheduleItem(
									event.scheduleItem.id,
								);
							} catch (error) {
								await notification?.notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "failure",
											message: notification.t(
												"scheduler.deleteFailure",
												{
													message:
														JSON.stringify(error),
												},
											),
										},
									},
								});
								throw error;
							}
							await notification?.notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "success",
										message: notification.t(
											"scheduler.deleteSuccess",
										),
									},
								},
							});
							const {
								instantaneous: instantaneousScheduleItems,
							} = currentModelView.scheduleItems;
							return {
								...currentModelView,
								scheduleItems: {
									...currentModelView.scheduleItems,
									instantaneous:
										instantaneousScheduleItems.filter(
											scheduleItem =>
												scheduleItem.id !== id,
										),
								},
							};
						}
						case "recurring": {
							try {
								await deleteRecurringScheduleItem(
									event.scheduleItem.id,
								);
							} catch (error) {
								await notification?.notifier.interact({
									type: "NOTIFY",
									input: {
										notification: {
											type: "failure",
											message: notification.t(
												"scheduler.deleteFailure",
												{
													message:
														JSON.stringify(error),
												},
											),
										},
									},
								});
								throw error;
							}
							await notification?.notifier.interact({
								type: "NOTIFY",
								input: {
									notification: {
										type: "success",
										message: notification.t(
											"scheduler.deleteSuccess",
										),
									},
								},
							});
							const { recurring: recurringScheduleItems } =
								currentModelView.scheduleItems;
							return {
								...currentModelView,
								scheduleItems: {
									...currentModelView.scheduleItems,
									recurring: recurringScheduleItems.filter(
										scheduleItem => scheduleItem.id !== id,
									),
								},
							};
						}
					}
				}
			}
		},
	} satisfies ViewInteractionInterface<
		SchedulerModelView,
		SchedulerModelInteraction
	>;
}

export function useScheduler(
	initialModelView: SchedulerModelView,
	notifier?: ToastNotifierModel,
) {
	const t = useTranslations();
	const model = useInitializedStatefulInteractiveModel(
		schedulerVIInterface(notifier ? { notifier, t } : undefined),
		initialModelView,
	);
	return model;
}
