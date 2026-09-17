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
				newEvent && "date" in newEvent.scheduleItem
					? [
							...instantaneousScheduleItems,
							parseNewScheduleItem(newEvent.scheduleItem),
						]
					: instantaneousScheduleItems,
				newEvent && "recurringPattern" in newEvent.scheduleItem
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
		<div className="flex flex-col gap-4">
			<Button
				model={newReadonlyModel({
					action() {
						interact({ type: "SWITCH_LANGUAGE" });
					},
					className:
						"bg-gray-800 hover:bg-gray-900 active:bg-gray-950",
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
				<div className="flex flex-col gap-3">
					<span className="text-xl">{t("newScheduleSection")}</span>
					<SchedulePreviewWidget
						model={newReadonlyModel({
							schedule: newSchedule,
							displayRemoved: true,
							maxDisplayedItems: maxItems,
							highlightedScheduleItem:
								"date" in newEvent.scheduleItem
									? pickScheduleItemTranslation(
											parseNewScheduleItem(
												newEvent.scheduleItem,
											),
											language,
										)
									: undefined,
						})}
					/>
				</div>
			)}
			<div className="flex flex-col gap-3">
				<span className="text-xl">{t("currentScheduleSection")}</span>
				<SchedulePreviewWidget
					model={newReadonlyModel({
						schedule: currentSchedule,
						displayRemoved: true,
						maxDisplayedItems: maxItems,
						modifyCallbacks,
					})}
				/>
			</div>
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<ViewScheduleSectionModel>>;

export default ViewScheduleSection;
