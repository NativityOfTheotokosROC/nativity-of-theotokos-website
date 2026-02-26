import ScheduleItem from "@/src/lib/component/schedule-item/ScheduleItem";
import { SchedulePreviewWidgetModel } from "@/src/lib/model/schedule-preview-widget";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";

const SchedulePreviewWidget = function ({ model }) {
	const { scheduleItems } = model.modelView;
	const orderedScheduleItems = [...scheduleItems].sort(
		(a, b) => a.date.getTime() - b.date.getTime(),
	);

	return (
		<div className="schedule-list flex flex-col w-full gap-4 pr-3 lg:pr-6 h-[27em] max-h-[27em] lg:h-[30em] lg:max-h-[30em] overflow-y-auto">
			<div className="flex grow [&_.featured-schedule-item]:grow">
				<ScheduleItem
					model={newReadonlyModel({
						scheduleItem: orderedScheduleItems[0],
						isFeatured: true,
					})}
				/>
			</div>
			<hr className="my-2 text-black/50" />
			<div className="flex flex-col gap-3 lg:w-3/4">
				{orderedScheduleItems.slice(1).map((scheduleItem, index) => (
					<ScheduleItem
						key={index}
						model={newReadonlyModel({
							scheduleItem,
							isFeatured: false,
						})}
					/>
				))}
			</div>
		</div>
	);
} satisfies ModeledVoidComponent<SchedulePreviewWidgetModel>;

export default SchedulePreviewWidget;
