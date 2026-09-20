import { ModeledVoidComponent } from "@mvc-react/components";
import { RecurringScheduleItemModel } from "../../models/recurring-schedule-item";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { twMerge } from "tailwind-merge";
import { toZonedTime } from "date-fns-tz";
import {
	getNativeTimeZone,
	pickTimeTranslation,
} from "../../utilities/date-time";
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
				"schedule-item recurring-schedule-item flex min-h-fit flex-col gap-1 overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3] px-5.5 py-4",
				isDisabled && "grayscale",
			)}
		>
			<span className="text-xl">{title}</span>
			<span>{venue}</span>
			<span>{description}</span>
			{nativeTimes.map(({ time, designation }, index) => (
				<div
					key={index}
					className="inline-flex max-w-full flex-wrap gap-1 text-sm"
				>
					<span className="w-17">
						{pickTimeTranslation(time, locale, {
							hour: true,
							minute: true,
							twelveHour: true,
						})}
					</span>
					<span className="underline">{designation}</span>
				</div>
			))}
			{options?.modifyCallbacks && (
				<div className="self-end">
					<EditScheduleItemPanel
						model={newReadonlyModel({
							event: { type: "recurring", scheduleItem },
							callbacks: options.modifyCallbacks,
						})}
					/>
				</div>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<RecurringScheduleItemModel>>;

export default RecurringScheduleItem;
