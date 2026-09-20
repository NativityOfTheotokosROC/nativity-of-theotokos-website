import ScheduleItem from "@/src/lib/components/schedule-item/ScheduleItem";
import { SchedulePreviewWidgetModel } from "@/src/lib/models/schedule-preview-widget";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { getDateString } from "../../utilities/date-time";

const SchedulePreviewWidget = function ({ model }) {
	const {
		schedule,
		maxDisplayedItems,
		displayRemoved,
		highlightedScheduleItem,
		scheduleItemOptions,
	} = model.modelView;
	const scheduleMap = new Map(
		schedule.map(
			scheduleItem =>
				[
					`${getDateString(scheduleItem.date)}_${scheduleItem.venue}`,
					scheduleItem,
				] as const,
		),
	);
	const highlightedScheduleItemKey = highlightedScheduleItem
		? (`${getDateString(
				highlightedScheduleItem.date,
			)}_${highlightedScheduleItem.venue}` as const)
		: undefined;
	if (highlightedScheduleItemKey)
		scheduleMap.delete(highlightedScheduleItemKey);
	const orderedSchedule = [
		...(displayRemoved
			? scheduleMap.values()
			: scheduleMap
					.values()
					.filter(scheduleItem => !scheduleItem.isRemoved)),
	].sort((a, b) => a.date.getTime() - b.date.getTime());

	if (schedule.length < 1) return <></>;

	return (
		<div className="schedule-list flex h-[27em] max-h-[27em] w-full flex-col items-stretch gap-4 overflow-y-auto pr-3 lg:h-[30em] lg:max-h-[30em] lg:pr-6">
			<ScheduleItem
				model={newReadonlyModel({
					scheduleItem: highlightedScheduleItem ?? orderedSchedule[0],
					variant: "detailed",
					options: scheduleItemOptions,
				})}
			/>
			<hr className="my-2 text-black/50" />
			<div className="flex flex-col gap-3 lg:w-3/4">
				{orderedSchedule
					.slice(highlightedScheduleItem ? 0 : 1, maxDisplayedItems)
					.map((scheduleItem, index) => (
						<ScheduleItem
							key={index}
							model={newReadonlyModel({
								scheduleItem,
								variant: "basic",
								options: scheduleItemOptions,
							})}
						/>
					))}
			</div>
		</div>
	);
} satisfies ModeledVoidComponent<SchedulePreviewWidgetModel>;

export default SchedulePreviewWidget;
