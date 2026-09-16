import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { BanIcon, CheckIcon, Edit2Icon } from "lucide-react";
import { EditScheduleItemPanelModel } from "../../models/edit-schedule-item-panel";

const EditScheduleItemPanel = function ({ model }) {
	const { event, callbacks } = model.modelView;
	const { scheduleItem } = event;

	if (!callbacks) return <></>;
	if ("id" in scheduleItem && scheduleItem.id === undefined) return <></>;
	if (
		"recurringItemId" in scheduleItem &&
		scheduleItem.recurringItemId === undefined
	)
		return <></>;

	return (
		<div className="flex gap-1 text-xs">
			{/* TODO: Add titles for accessibility*/}
			<button
				className="no-outline"
				onClick={() => callbacks.editCallback(event)}
			>
				<Edit2Icon strokeWidth={1} />
			</button>
			<button
				className="no-outline"
				onClick={() => callbacks.toggleCallback(event)}
			>
				{("isRemoved" in scheduleItem && scheduleItem.isRemoved) ||
				("recurringPattern" in scheduleItem &&
					scheduleItem.isDisabled) ? (
					<CheckIcon strokeWidth={1} />
				) : (
					<BanIcon strokeWidth={1} />
				)}
			</button>
			{event.type !== "recurringInstance" &&
				"id" in event.scheduleItem &&
				event.scheduleItem.id && (
					<button
						className="no-outline"
						onClick={() => callbacks.deleteCallback(event)}
					>
						<Edit2Icon strokeWidth={1} />
					</button>
				)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<EditScheduleItemPanelModel>>;

export default EditScheduleItemPanel;
