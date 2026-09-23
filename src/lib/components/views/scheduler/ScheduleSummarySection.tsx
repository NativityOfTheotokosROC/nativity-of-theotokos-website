import { ScheduleSummarySectionModel } from "@/src/lib/models/schedule-summary-section";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import ScheduleItem from "../../schedule-item/ScheduleItem";
import RecurringScheduleItem from "../../schedule-item/RecurringScheduleItem";

const ScheduleSummarySection = function ({ model }) {
	const {
		instantaneousScheduleItems,
		recurringScheduleItems,
		modifyCallbacks,
	} = model.modelView;
	const t = useTranslations("scheduler");
	const hasInstantaneousItems = instantaneousScheduleItems.length > 0;
	const hasRecurringItems = recurringScheduleItems.length > 0;
	const orderedInstantaneousItems = instantaneousScheduleItems
		.toSorted((a, b) => a.date.getTime() - b.date.getTime())
		.toSorted((a, b) => Number(b.isRemoved) - Number(a.isRemoved));
	const orderedRecurringItems = recurringScheduleItems.toSorted(
		(a, b) => Number(b.isDisabled) - Number(a.isDisabled),
	);

	return (
		<div className="flex flex-col gap-6 pt-3">
			{hasRecurringItems && (
				<div className="flex flex-col gap-3">
					<span className="uppercase">{t("recurringEvents")}</span>
					<div className="flex max-h-100 w-full flex-col gap-2 overflow-y-auto pr-2">
						{orderedRecurringItems.map(scheduleItem => (
							<RecurringScheduleItem
								key={scheduleItem.id}
								model={newReadonlyModel({
									scheduleItem,
									options: {
										modifyCallbacks,
										className: "bg-white",
									},
								})}
							/>
						))}
					</div>
				</div>
			)}
			{hasInstantaneousItems && (
				<div className="flex flex-col gap-3">
					<span className="uppercase">{t("specificEvents")}</span>
					<div className="flex max-h-100 w-full flex-col gap-2 overflow-y-auto pr-2">
						{orderedInstantaneousItems.map(scheduleItem => (
							<ScheduleItem
								key={scheduleItem.id}
								model={newReadonlyModel({
									scheduleItem,
									variant: "detailed",
									options: {
										modifyCallbacks,
										className: "bg-white",
									},
								})}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<ScheduleSummarySectionModel>>;

export default ScheduleSummarySection;
