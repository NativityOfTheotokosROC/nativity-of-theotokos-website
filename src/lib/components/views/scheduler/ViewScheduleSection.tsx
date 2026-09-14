import { ViewScheduleSectionModel } from "@/src/lib/models/view-schedule-section";
import { generateSchedule } from "@/src/lib/utilities/schedule";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import RussianGraphic from "@/public/assets/russian.svg";
import EnglishGraphic from "@/public/assets/english.svg";
import Button from "../../button/Button";
import { useTranslations } from "next-intl";

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
		maxItems,
	} = modelView;
	const schedule = generateSchedule(
		pendingScheduleItem && "date" in pendingScheduleItem
			? [...instantaneousScheduleItems, pendingScheduleItem]
			: instantaneousScheduleItems,
		pendingScheduleItem && "recurringPattern" in pendingScheduleItem
			? [...recurringScheduleItems, pendingScheduleItem]
			: recurringScheduleItems,
		maxItems ?? 10,
	);
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
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<ViewScheduleSectionModel>>;

export default ViewScheduleSection;
