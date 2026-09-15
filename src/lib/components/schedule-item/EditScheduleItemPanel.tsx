import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, ReadonlyModel } from "@mvc-react/mvc";
import { Edit2Icon, CheckIcon, BanIcon } from "lucide-react";
import { ScheduleItemModelView } from "../../models/schedule-item";
import {
	EditScheduleItemPanelModel,
	EditScheduleItemPanelModelView,
	ScheduleItemType,
} from "../../models/edit-schedule-item-panel";

const EditScheduleItemPanel = function ({ model }) {
	const { scheduleItem, callbacks } = model.modelView;

	if (!callbacks) return <></>;
	if ("id" in scheduleItem && scheduleItem.id === undefined) return <></>;
	if (
		"recurringItemId" in scheduleItem &&
		scheduleItem.recurringItemId === undefined
	)
		return <></>;
	const scheduleItemId =
		"id" in scheduleItem
			? scheduleItem.id!
			: "recurringItemId" in scheduleItem
				? scheduleItem.recurringItemId!
				: (undefined as never);
	const scheduleItemType = (
		"recurringItemId" in scheduleItem
			? "recurringInstance"
			: "recurringPattern" in scheduleItem
				? "recurring"
				: "specific"
	) satisfies ScheduleItemType;

	return (
		<div className="flex gap-1 text-xs">
			{/* TODO: Add titles */}
			<button
				className="no-outline"
				onClick={() =>
					callbacks.editCallback(scheduleItemId, scheduleItemType)
				}
			>
				<Edit2Icon strokeWidth={1} />
			</button>
			<button
				className="no-outline"
				onClick={() =>
					callbacks.toggleCallback(scheduleItemId, scheduleItemType)
				}
			>
				{("isRemoved" in scheduleItem && scheduleItem.isRemoved) ||
				("recurringPattern" in scheduleItem &&
					scheduleItem.isDisabled) ? (
					<CheckIcon strokeWidth={1} />
				) : (
					<BanIcon strokeWidth={1} />
				)}
			</button>
			{"id" in scheduleItem && (
				<button
					className="no-outline"
					onClick={() =>
						callbacks.deleteCallback(
							scheduleItemId,
							scheduleItemType,
						)
					}
				>
					<Edit2Icon strokeWidth={1} />
				</button>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<EditScheduleItemPanelModel>>;

export default EditScheduleItemPanel;
