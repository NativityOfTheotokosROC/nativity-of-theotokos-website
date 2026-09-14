"use client";

import FeaturedItemOrnament from "@/public/assets/ornament_12.svg";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { toZonedTime } from "date-fns-tz";
import { BanIcon, CheckIcon, Edit2Icon } from "lucide-react";
import { useLocale } from "next-intl";
import { twMerge } from "tailwind-merge";
import {
	ScheduleItemModel,
	ScheduleItemModelView,
} from "../../models/schedule-item";
import { georgia } from "../../third-party/fonts";
import { getNativeTimeZone } from "../../utilities/date-time";
import { MakeRequired } from "../../utilities/types";

const ScheduleItem = function ({ model }) {
	const { scheduleItem, variant, maxDisplayedTimes, options } =
		model.modelView;
	const { title, venue, date, times } = scheduleItem;
	const locale = useLocale();
	const dateLocale = locale === "en" ? "en-uk" : "ru-RU";
	const nativeDate = toZonedTime(date, getNativeTimeZone());
	const nativeTimes = times
		.map(time => ({
			...time,
			time: toZonedTime(time.time, getNativeTimeZone()),
		}))
		.slice(0, maxDisplayedTimes ?? 3);
	const isItemRemoved = "isRemoved" in scheduleItem && scheduleItem.isRemoved;
	const isPending =
		("id" in scheduleItem && !scheduleItem.id) ||
		("recurringItemId" in scheduleItem && !scheduleItem.recurringItemId);
	const isEditable = !isPending && options?.callbacks;

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
					{nativeDate.toLocaleDateString(dateLocale, {
						day: "2-digit",
					})}
				</span>
				<span className="uppercase">
					{nativeDate.toLocaleDateString(dateLocale, {
						month: "short",
						year: "2-digit",
					})}
				</span>
				<FeaturedItemOrnament className="h-10 w-10" fill="#fff" />
			</div>
			<div className="flex flex-col gap-1 px-5.5 py-4">
				<span className="text-xl">{title}</span>
				<span>{venue}</span>
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
			</div>
		</div>
	) : variant === "basic" ? (
		<div className="schedule-item flex items-center overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3]">
			<div
				className={`flex w-full max-w-[5em] grow flex-col items-center gap-1 self-stretch bg-gray-900 p-4 text-center text-white ${georgia.className}`}
			>
				<span className="text-xl">
					{nativeDate.toLocaleDateString(dateLocale, {
						day: "2-digit",
					})}
				</span>
				<span className="text-xs uppercase">
					{nativeDate.toLocaleDateString(dateLocale, {
						month: "short",
						year: "2-digit",
					})}
				</span>
			</div>
			<div className="flex flex-col gap-1 px-4 py-2">
				<span className="text-lg">{title}</span>
				<span className="text-sm">{venue}</span>
				<span className="text-sm">
					{nativeTimes[0].time
						.toLocaleTimeString(dateLocale, {
							hour: "numeric",
							minute: "2-digit",
							hour12: true,
						})
						.toUpperCase()}
				</span>
				{isEditable && (
					<div className="contents pointer-fine:invisible pointer-fine:group-hover/edit-bar:visible">
						<EditBar
							model={newReadonlyModel({
								scheduleItem,
								callbacks: options?.callbacks,
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

const EditBar = function ({ model }) {
	const { scheduleItem, callbacks } = model.modelView;

	if (!callbacks) return <></>;
	if ("id" in scheduleItem && scheduleItem.id === undefined) return <></>;
	if (
		"recurringItemId" in scheduleItem &&
		scheduleItem.recurringItemId === undefined
	)
		return <></>;
	const scheduleItemId =
		"id" in scheduleItem
			? scheduleItem.id!
			: "recurringItemId" in scheduleItem
				? scheduleItem.recurringItemId!
				: (undefined as never);

	return (
		<div className="flex gap-1 text-xs">
			{/* TODO: Add titles */}
			<button
				className="no-outline"
				onClick={() => callbacks.editCallback(scheduleItemId)}
			>
				<Edit2Icon strokeWidth={1} />
			</button>
			<button
				className="no-outline"
				onClick={() => callbacks.toggleCallback(scheduleItemId)}
			>
				{"isRemoved" in scheduleItem && scheduleItem.isRemoved ? (
					<CheckIcon strokeWidth={1} />
				) : (
					<BanIcon strokeWidth={1} />
				)}
			</button>
			{"id" in scheduleItem && (
				<button
					className="no-outline"
					onClick={() => callbacks.deleteCallback(scheduleItemId)}
				>
					<Edit2Icon strokeWidth={1} />
				</button>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{
		scheduleItem: ScheduleItemModelView["scheduleItem"];
		callbacks?: Required<
			NonNullable<ScheduleItemModelView["options"]>
		>["callbacks"];
	}>
>;

export default ScheduleItem;
