import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import cronstrue from "cronstrue";
import "cronstrue/locales/en";
import "cronstrue/locales/ru";
import { useLocale, useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import { RecurringScheduleItemModel } from "../../models/recurring-schedule-item";
import { getDateString, pickTimeTranslation } from "../../utilities/date-time";
import EditScheduleItemPanel from "./EditScheduleItemPanel";

const RecurringScheduleItem = function ({ model }) {
	const { scheduleItem, options, maxDisplayedTimes = 3 } = model.modelView;
	const { title, venue, times, recurringPattern, isDisabled } = scheduleItem;
	const locale = useLocale();
	const t = useTranslations("recurringScheduleItem");
	const tokenDate = new Date();
	const sortedTimes = times
		.map(({ time, designation }) => ({
			designation,
			time: new Date(`${getDateString(tokenDate)}T${time}`),
		}))
		.sort((a, b) => a.time.getTime() - b.time.getTime())
		.slice(0, maxDisplayedTimes);
	const description = t("description", {
		parsedCronString: cronstrue.toString(recurringPattern, { locale }),
	});

	return (
		<div
			className={twMerge(
				"schedule-item recurring-schedule-item flex min-h-fit flex-col gap-1 overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3] px-5.5 py-4",
				isDisabled && "opacity-70 grayscale",
				options?.className,
			)}
		>
			<span className="text-xl">{title}</span>
			<span>{venue}</span>
			<span>{description}</span>
			{sortedTimes.map(({ time, designation }, index) => (
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
				<div className="mt-auto">
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
