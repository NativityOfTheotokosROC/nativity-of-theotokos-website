import { ModeledVoidComponent } from "@mvc-react/components";
import { RecurringScheduleItemModel } from "../../models/recurring-schedule-item";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { twMerge } from "tailwind-merge";
import { toZonedTime } from "date-fns-tz";
import { getNativeTimeZone } from "../../utilities/date-time";
import { useLocale, useTranslations } from "next-intl";
import EditScheduleItemPanel from "./EditScheduleItemPanel";
import cronstrue from "cronstrue";
import "cronstrue/locales/en";
import "cronstrue/locales/ru";

const RecurringScheduleItem = function ({ model }) {
	const { scheduleItem, options, maxDisplayedTimes = 3 } = model.modelView;
	const { title, venue, times, recurringPattern, isDisabled } = scheduleItem;
	const locale = useLocale();
	const t = useTranslations("recurringScheduleItem");
	const dateLocale = locale === "ru" ? "ru-RU" : "en-uk";
	const nativeTimes = times
		.map(time => ({
			...time,
			time: toZonedTime(time.time, getNativeTimeZone()),
		}))
		.slice(0, maxDisplayedTimes ?? 3);
	const description = t("description", {
		parsedCronString: cronstrue.toString(recurringPattern, { locale }),
	});

	return (
		<div
			className={twMerge(
				"schedule-item recurring-schedule-item group/edit-bar flex min-h-fit flex-col gap-1 overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3] px-5.5 py-4",
				isDisabled && "grayscale",
			)}
		>
			<span className="text-xl">{title}</span>
			<span>{venue}</span>
			<span>{description}</span>
			{nativeTimes.map((time, index) => (
				<div
					key={index}
					className="inline-flex max-w-full flex-wrap gap-1 text-sm"
				>
					<span className="w-17">
						{time.time
							.toLocaleTimeString(dateLocale, {
								hour: "numeric",
								minute: "2-digit",
								hour12: true,
							})
							.toUpperCase()}
					</span>
					<span className="underline">{time.designation}</span>
				</div>
			))}
			{options?.modifyCallbacks && (
				<div className="contents pointer-fine:invisible pointer-fine:group-hover/edit-bar:visible">
					<EditScheduleItemPanel
						model={newReadonlyModel({
							scheduleItem,
							callbacks: options.modifyCallbacks,
						})}
					/>
				</div>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<RecurringScheduleItemModel>>;

export default RecurringScheduleItem;
