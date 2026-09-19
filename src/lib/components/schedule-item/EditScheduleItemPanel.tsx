import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { BanIcon, CheckIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import { EditScheduleItemPanelModel } from "../../models/edit-schedule-item-panel";
import { ScheduleEvent } from "../../utilities/schedule";

const EditScheduleItemPanel = function ({ model }) {
	const { event, callbacks } = model.modelView;
	const { scheduleItem } = event;

	return (
		<div className="flex gap-2 text-xs">
			{/* TODO: Add titles for accessibility*/}
			<button
				className="no-outline flex items-center"
				onClick={() => callbacks.editCallback(event)}
			>
				<Edit2Icon className="size-10" strokeWidth={1} />
			</button>
			<button
				className="no-outline flex items-center"
				onClick={() => callbacks.toggleCallback(event)}
			>
				{("isRemoved" in scheduleItem && scheduleItem.isRemoved) ||
				("recurringPattern" in scheduleItem &&
					scheduleItem.isDisabled) ? (
					<CheckIcon className="size-6" strokeWidth={1} />
				) : (
					<BanIcon className="size-6" strokeWidth={1} />
				)}
			</button>
			{event.type !== "recurringInstance" &&
				"id" in event.scheduleItem &&
				event.scheduleItem.id !== undefined && (
					<button
						className="no-outline flex items-center"
						onClick={() =>
							callbacks.deleteCallback(event as ScheduleEvent)
						}
					>
						<Trash2Icon className="size-6" strokeWidth={1} />
					</button>
				)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<EditScheduleItemPanelModel>>;

export default EditScheduleItemPanel;
