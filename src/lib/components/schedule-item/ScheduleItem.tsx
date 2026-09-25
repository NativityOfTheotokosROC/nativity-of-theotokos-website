"use client";

import NormalEventOrnament from "@/public/assets/ornament_12.svg";
import FeastEventOrnament from "@/public/assets/icon-4.svg";
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
	const { title, venue, date, times, eventType } = scheduleItem;
	const locale = useLocale();
	const language = options?.language ?? locale;
	const nativeDate = toZonedTime(date, getNativeTimeZone());
	const sortedTimes = times
		.map(({ designation, time }) => ({
			designation,
			time: new Date(`${getDateString(nativeDate)}T${time}`),
		}))
		.sort((a, b) => a.time.getTime() - b.time.getTime())
		.slice(0, maxDisplayedTimes ?? 3);
	const isPending =
		("id" in scheduleItem && !scheduleItem.id) ||
		("recurringItemId" in scheduleItem && !scheduleItem.recurringItemId);

	if (variant === "detailed")
		return (
			<div
				className={twMerge(
					"schedule-item flex h-fit overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3]",
					scheduleItem.isRemoved && "opacity-70 grayscale",
					isPending && "border-4 border-dashed",
					options?.className,
				)}
			>
				<div
					className={twMerge(
						`flex max-w-25 min-w-24 grow flex-col items-center gap-2 self-stretch bg-gray-900 p-4 px-5 text-center text-white ${georgia.className}`,
						eventType === "feast"
							? "bg-purple-950"
							: eventType === "special"
								? "bg-green-950"
								: undefined,
					)}
				>
					<span className="text-4xl">
						{pickDateTranslation(nativeDate, language, {
							day: true,
						})}
					</span>
					<span className="uppercase">
						{pickDateTranslation(nativeDate, language, {
							month: true,
							year: true,
						})}
					</span>
					{eventType === "feast" ? (
						<FeastEventOrnament className="h-10 w-10" fill="#fff" />
					) : (
						<NormalEventOrnament
							className="h-10 w-10"
							fill="#fff"
						/>
					)}
				</div>
				<div className="flex flex-col gap-1 px-5.5 py-4">
					<span className="text-xl">{title}</span>
					<span>{venue}</span>
					{sortedTimes.map(({ time, designation }, index) => (
						<div
							key={index}
							className="inline-flex max-w-full flex-wrap gap-1 text-sm"
						>
							<span className="w-17">
								{pickTimeTranslation(time, language, {
									hour: true,
									minute: true,
									twelveHour: true,
								})}
							</span>
							<span className="underline">{designation}</span>
						</div>
					))}
					{options &&
						options.modifyCallbacks &&
						(("recurringItemId" in scheduleItem &&
							recurringScheduleItemInstanceHasId(scheduleItem)) ||
							("id" in scheduleItem &&
								instantaneousScheduleItemHasId(
									scheduleItem,
								))) && (
							<div className="mt-auto">
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
		);
	if (variant === "basic")
		return (
			<div
				className={twMerge(
					"schedule-item flex h-fit items-center overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3]",
					scheduleItem.isRemoved && "opacity-70 grayscale",
					isPending && "border-4 border-dashed",
					options?.className,
				)}
			>
				<div
					className={twMerge(
						`flex w-full max-w-[5em] grow flex-col items-center gap-1 self-stretch bg-gray-900 p-4 text-center text-white ${georgia.className}`,
						eventType === "feast"
							? "bg-purple-950"
							: eventType === "special"
								? "bg-green-950"
								: undefined,
					)}
				>
					<span className="text-xl">
						{pickDateTranslation(nativeDate, language, {
							day: true,
						})}
					</span>
					<span className="text-xs uppercase">
						{pickDateTranslation(nativeDate, language, {
							month: true,
							year: true,
						})}
					</span>
				</div>
				<div className="flex flex-col gap-1 px-4 py-2">
					<span className="text-lg">{title}</span>
					<span className="text-sm">{venue}</span>
					<span className="text-sm">
						{pickTimeTranslation(sortedTimes[0].time, language, {
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
								instantaneousScheduleItemHasId(
									scheduleItem,
								))) && (
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
						)}
				</div>
			</div>
		);
} as ModeledVoidComponent<ScheduleItemModel>;

export default ScheduleItem;
