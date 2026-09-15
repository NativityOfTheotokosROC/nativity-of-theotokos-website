import EnglishGraphic from "@/public/assets/english.svg";
import RussianGraphic from "@/public/assets/russian.svg";
import { ViewScheduleSectionModel } from "@/src/lib/models/view-schedule-section";
import {
	generateSchedule,
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
		pendingScheduleItem,
		modifyCallbacks,
		language,
		maxItems = 10,
	} = modelView;
	const currentSchedule = generateSchedule(
		instantaneousScheduleItems,
		recurringScheduleItems,
		maxItems,
	).map(scheduleItem => pickScheduleItemTranslation(scheduleItem, language));
	const newSchedule = pendingScheduleItem
		? generateSchedule(
				pendingScheduleItem && "date" in pendingScheduleItem
					? [...instantaneousScheduleItems, pendingScheduleItem]
					: instantaneousScheduleItems,
				pendingScheduleItem && "recurringPattern" in pendingScheduleItem
					? [...recurringScheduleItems, pendingScheduleItem]
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
			{pendingScheduleItem && (
				<div className="flex flex-col gap-3">
					<span className="text-xl">{t("newScheduleSection")}</span>
					<SchedulePreviewWidget
						model={newReadonlyModel({
							schedule: newSchedule,
							displayRemoved: true,
							maxDisplayedItems: maxItems,
							highlightedScheduleItem:
								"date" in pendingScheduleItem
									? pickScheduleItemTranslation(
											pendingScheduleItem,
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
