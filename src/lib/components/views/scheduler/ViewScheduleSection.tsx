import EnglishGraphic from "@/public/assets/english.svg";
import RussianGraphic from "@/public/assets/russian.svg";
import { ViewScheduleSectionModel } from "@/src/lib/models/view-schedule-section";
import {
	generateSchedule,
	parseNewScheduleItem,
	pickScheduleItemTranslation,
} from "@/src/lib/utilities/schedule";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import Button from "../../button/Button";
import SchedulePreviewWidget from "../../schedule-preview-widget/SchedulePreviewWidget";

const ViewScheduleSection = function ({ model }) {
	const { modelView, interact } = model;
	const {
		currentScheduleItems: {
			instantaneousScheduleItems,
			recurringScheduleItems,
		},
		newEvent,
		modifyCallbacks,
		language,
		maxItems = 10,
	} = modelView;
	const currentSchedule = generateSchedule(
		instantaneousScheduleItems,
		recurringScheduleItems,
		maxItems,
	).map(scheduleItem => pickScheduleItemTranslation(scheduleItem, language));
	const newSchedule = newEvent
		? generateSchedule(
				newEvent.type === "specific"
					? [
							...instantaneousScheduleItems,
							parseNewScheduleItem(newEvent.scheduleItem),
						]
					: instantaneousScheduleItems,
				newEvent.type === "recurring"
					? [
							...recurringScheduleItems,
							parseNewScheduleItem(newEvent.scheduleItem),
						]
					: recurringScheduleItems,
				maxItems,
			).map(scheduleItem =>
				pickScheduleItemTranslation(scheduleItem, language),
			)
		: currentSchedule;
	const t = useTranslations("scheduler");
	const tMisc = useTranslations("miscellaneous");

	return (
		<div className="view-schedule flex flex-col gap-6 pt-3">
			<Button
				model={newReadonlyModel({
					action() {
						interact({ type: "SWITCH_LANGUAGE" });
					},
					className:
						"bg-gray-800 hover:bg-gray-900 active:bg-gray-950 w-full",
				})}
			>
				<span className="flex items-center gap-2">
					{language === "en" ? (
						<>
							<RussianGraphic className="size-5" />
							<span>{tMisc("russian")}</span>
						</>
					) : (
						<>
							<EnglishGraphic className="size-5" />
							<span>{tMisc("english")}</span>
						</>
					)}
				</span>
			</Button>
			{newEvent && (
				<div className="new-event-section flex flex-col gap-3">
					<span className="uppercase">{t("newScheduleSection")}</span>
					<SchedulePreviewWidget
						model={newReadonlyModel({
							schedule: newSchedule,
							displayRemoved: true,
							maxDisplayedItems: maxItems,
							highlightedScheduleItem:
								newEvent.type === "specific"
									? pickScheduleItemTranslation(
											parseNewScheduleItem(
												newEvent.scheduleItem,
											),
											language,
										)
									: undefined,
							scheduleItemOptions: {
								className: "bg-white",
								language,
							},
						})}
					/>
				</div>
			)}
			{currentSchedule.length > 0 && (
				<div className="flex flex-col gap-3">
					<span className="uppercase">
						{t("currentScheduleSection")}
					</span>
					<SchedulePreviewWidget
						model={newReadonlyModel({
							schedule: currentSchedule,
							displayRemoved: true,
							maxDisplayedItems: maxItems,
							scheduleItemOptions: {
								className: "bg-white",
								modifyCallbacks,
								language,
							},
						})}
					/>
				</div>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<ViewScheduleSectionModel>>;

export default ViewScheduleSection;
