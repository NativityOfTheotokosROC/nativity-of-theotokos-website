"use client";

import FeaturedItemOrnament from "@/public/assets/ornament_12.svg";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { toZonedTime } from "date-fns-tz";
import { useLocale } from "next-intl";
import { twMerge } from "tailwind-merge";
import { ScheduleItemModel } from "../../models/schedule-item";
import { georgia } from "../../third-party/fonts";
import {
	getDateString,
	getNativeTimeZone,
	pickDateTranslation,
	pickTimeTranslation,
} from "../../utilities/date-time";
import {
	instantaneousScheduleItemHasId,
	recurringScheduleItemInstanceHasId,
} from "../../utilities/schedule";
import EditScheduleItemPanel from "./EditScheduleItemPanel";

const ScheduleItem = function ({ model }) {
	const { scheduleItem, variant, maxDisplayedTimes, options } =
		model.modelView;
	const { title, venue, date, times } = scheduleItem;
	const locale = useLocale();
	const nativeDate = toZonedTime(date, getNativeTimeZone());
	const nativeTimes = times
		.map(({ designation, time }) => ({
			designation,
			time: toZonedTime(
				`${getDateString(date)}T${time}`,
				getNativeTimeZone(),
			),
		}))
		.slice(0, maxDisplayedTimes ?? 3);
	const isItemRemoved = "isRemoved" in scheduleItem && scheduleItem.isRemoved;
	const isPending =
		("id" in scheduleItem && !scheduleItem.id) ||
		("recurringItemId" in scheduleItem && !scheduleItem.recurringItemId);

	return variant === "detailed" ? (
		<div
			className={twMerge(
				"schedule-item group/edit-bar flex min-h-fit overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3]",
				isItemRemoved && "grayscale",
				isPending && "border border-dashed",
				options?.className,
			)}
		>
			<div
				className={`flex max-w-25 min-w-24 grow flex-col items-center gap-2 self-stretch bg-gray-900 p-4 px-5 text-center text-white ${georgia.className}`}
			>
				<span className="text-4xl">
					{pickDateTranslation(nativeDate, locale, { day: true })}
				</span>
				<span className="uppercase">
					{pickDateTranslation(nativeDate, locale, {
						month: true,
						year: true,
					})}
				</span>
				<FeaturedItemOrnament className="h-10 w-10" fill="#fff" />
			</div>
			<div className="flex flex-col gap-1 px-5.5 py-4">
				<span className="text-xl">{title}</span>
				<span>{venue}</span>
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
			</div>
		</div>
	) : variant === "basic" ? (
		<div className="schedule-item flex items-center overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3]">
			<div
				className={`flex w-full max-w-[5em] grow flex-col items-center gap-1 self-stretch bg-gray-900 p-4 text-center text-white ${georgia.className}`}
			>
				<span className="text-xl">
					{pickDateTranslation(nativeDate, locale, { day: true })}
				</span>
				<span className="text-xs uppercase">
					{pickDateTranslation(nativeDate, locale, {
						month: true,
						year: true,
					})}
				</span>
			</div>
			<div className="flex flex-col gap-1 px-4 py-2">
				<span className="text-lg">{title}</span>
				<span className="text-sm">{venue}</span>
				<span className="text-sm">
					{pickTimeTranslation(nativeTimes[0].time, locale, {
						hour: true,
						minute: true,
						twelveHour: true,
					})}
				</span>
				{options &&
					options.modifyCallbacks &&
					(("recurringItemId" in scheduleItem &&
						recurringScheduleItemInstanceHasId(scheduleItem)) ||
						("id" in scheduleItem &&
							instantaneousScheduleItemHasId(scheduleItem))) && (
						<div className="contents pointer-fine:invisible pointer-fine:group-hover/edit-bar:visible">
							<EditScheduleItemPanel
								model={newReadonlyModel({
									event:
										"recurringItemId" in scheduleItem
											? {
													type: "recurringInstance",
													scheduleItem,
												}
											: {
													type: "specific",
													scheduleItem,
												},
									callbacks: options.modifyCallbacks,
								})}
							/>
						</div>
					)}
			</div>
		</div>
	) : (
		<></>
	);
} as ModeledVoidComponent<ScheduleItemModel>;

export default ScheduleItem;
