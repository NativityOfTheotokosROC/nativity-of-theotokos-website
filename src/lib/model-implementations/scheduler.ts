import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
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
import { UninitializedModelError } from "../utilities/errors";
import { parseNewScheduleItemWithId } from "../utilities/schedule";
import { getDateString } from "../utilities/date-time";
import {
	InstantaneousScheduleItem,
	Translation,
	RecurringScheduleItem,
} from "../utilities/types";

export function schedulerVIInterface() {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "SCHEDULE_EVENT":
					if (!currentModelView) throw new UninitializedModelError();
					const { id, newEvent } = interaction.input;
					switch (newEvent.type) {
						case "specific": {
							const { instantaneousScheduleItems } =
								currentModelView.scheduleItems;
							let newInstantaneousScheduleItems =
								instantaneousScheduleItems;
							if (id !== undefined) {
								await updateInstantaneousItem(
									id,
									newEvent.scheduleItem,
								);
								newInstantaneousScheduleItems = [
									...instantaneousScheduleItems.filter(
										scheduleItem => scheduleItem.id !== id,
									),
									parseNewScheduleItemWithId(
										newEvent.scheduleItem,
										id,
									),
								];
							} else {
								const newScheduleItem =
									await scheduleInstantaneousItem(
										newEvent.scheduleItem,
									);
								newInstantaneousScheduleItems = [
									...instantaneousScheduleItems,
									newScheduleItem,
								];
							}
							return {
								...currentModelView,
								scheduleItems: {
									...currentModelView.scheduleItems,
									instantaneousScheduleItems:
										newInstantaneousScheduleItems,
								},
								eventToEdit: { type: newEvent.type },
							};
						}
						case "recurring": {
							const { recurringScheduleItems } =
								currentModelView.scheduleItems;
							let newRecurringScheduleItems =
								recurringScheduleItems;
							if (id !== undefined) {
								await updateRecurringItem(
									id,
									newEvent.scheduleItem,
								);
								newRecurringScheduleItems = [
									...recurringScheduleItems.filter(
										scheduleItem => scheduleItem.id !== id,
									),
									parseNewScheduleItemWithId(
										newEvent.scheduleItem,
										id,
									),
								];
							} else {
								const newScheduleItem =
									await scheduleRecurringItem(
										newEvent.scheduleItem,
									);
								newRecurringScheduleItems = [
									...recurringScheduleItems,
									newScheduleItem,
								];
							}
							return {
								...currentModelView,
								scheduleItems: {
									...currentModelView.scheduleItems,
									recurringScheduleItems:
										newRecurringScheduleItems,
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
							const instantaneousScheduleItems =
								currentModelView.scheduleItems
									.instantaneousScheduleItems;
							const newInstantaneousScheduleItems = [
								{
									...instantaneousScheduleItems.find(
										scheduleItem =>
											scheduleItem.id ===
											event.scheduleItem.id,
									)!,
									isRemoved: !event.scheduleItem.isRemoved,
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
									instantaneousScheduleItems:
										newInstantaneousScheduleItems,
								},
							};
						}
						case "recurring": {
							await toggleRecurringItem(
								event.scheduleItem.id,
								!event.scheduleItem.isDisabled,
							);
							const recurringScheduleItems =
								currentModelView.scheduleItems
									.recurringScheduleItems;
							const newRecurringScheduleItems = [
								{
									...recurringScheduleItems.find(
										scheduleItem =>
											scheduleItem.id ===
											event.scheduleItem.id,
									)!,
									isDisabled: !event.scheduleItem.isDisabled,
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
									recurringScheduleItems:
										newRecurringScheduleItems,
								},
							};
						}
						case "recurringInstance": {
							const recurringScheduleItem =
								currentModelView.scheduleItems.recurringScheduleItems.find(
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
									isRemoved: !event.scheduleItem.isRemoved,
								});
							const newInstantaneousScheduleItems = [
								...currentModelView.scheduleItems
									.instantaneousScheduleItems,
								newScheduleItem,
							];
							return {
								...currentModelView,
								scheduleItems: {
									...currentModelView.scheduleItems,
									instantaneousScheduleItems:
										newInstantaneousScheduleItems,
								},
							};
						}
					}
				}
				case "DELETE_EVENT": {
					if (!currentModelView) throw new UninitializedModelError();
					const { event } = interaction.input;
					switch (event.type) {
						case "specific": {
							await deleteInstantaneousScheduleItem(
								event.scheduleItem.id,
							);
							const { instantaneousScheduleItems } =
								currentModelView.scheduleItems;
							return {
								...currentModelView,
								scheduleItems: {
									...currentModelView.scheduleItems,
									instantaneousScheduleItems:
										instantaneousScheduleItems.filter(
											scheduleItem =>
												scheduleItem.id !== id,
										),
								},
							};
						}
						case "recurring": {
							await deleteRecurringScheduleItem(
								event.scheduleItem.id,
							);
							const { recurringScheduleItems } =
								currentModelView.scheduleItems;
							return {
								...currentModelView,
								scheduleItems: {
									...currentModelView.scheduleItems,
									recurringScheduleItems:
										recurringScheduleItems.filter(
											scheduleItem =>
												scheduleItem.id !== id,
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

export function useScheduler(scheduleItems: {
	instantaneous: InstantaneousScheduleItem<Translation>[];
	recurring: RecurringScheduleItem<Translation>[];
}) {
	const model = useInitializedStatefulInteractiveModel(
		schedulerVIInterface(),
		{
			eventToEdit: { type: "specific" },
			scheduleItems: {
				instantaneousScheduleItems: scheduleItems.instantaneous,
				recurringScheduleItems: scheduleItems.recurring,
			},
		},
	);
	return model;
}
