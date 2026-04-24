"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { ScheduleItemModel } from "../../models/schedule-item";
import { georgia } from "../../third-party/fonts";
import { useLocale } from "next-intl";
import { toZonedTime } from "date-fns-tz";
import FeaturedItemOrnament from "@/public/assets/ornament_12.svg";
import { getLocalTimeZone } from "../../utilities/date-time";

const ScheduleItem = function ({ model }) {
	const { scheduleItem, isFeatured } = model.modelView;
	const { date: rawDate, location, times: rawTimes, title } = scheduleItem;
	const locale = useLocale();
	const dateLocale = locale === "en" ? "en-uk" : "ru-RU";
	const date = toZonedTime(rawDate, getLocalTimeZone());
	const times = rawTimes.map(time => ({
		...time,
		time: toZonedTime(time.time, getLocalTimeZone()),
	}));

	return isFeatured ? (
		<div className="featured-schedule-item flex min-h-fit overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3]">
			<div
				className={`flex max-w-25 min-w-24 grow flex-col items-center gap-2 self-stretch bg-gray-900 p-4 px-5 text-center text-white ${georgia.className}`}
			>
				<span className="text-4xl">
					{date.toLocaleDateString(dateLocale, { day: "2-digit" })}
				</span>
				<span className="uppercase">
					{date.toLocaleDateString(dateLocale, {
						month: "short",
						year: "2-digit",
					})}
				</span>
				<FeaturedItemOrnament className="h-10 w-10" fill="#fff" />
			</div>
			<div className="flex flex-col gap-1 px-5.5 py-4">
				<span className="text-xl">{title}</span>
				<span>{location}</span>
				{times.map((time, index) => (
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
	) : (
		<div className="schedule-item flex items-center overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3]">
			<div
				className={`flex w-full max-w-[5em] grow flex-col items-center gap-1 self-stretch bg-gray-900 p-4 text-center text-white ${georgia.className}`}
			>
				<span className="text-xl">
					{date.toLocaleDateString(dateLocale, { day: "2-digit" })}
				</span>
				<span className="text-xs uppercase">
					{date.toLocaleDateString(dateLocale, {
						month: "short",
						year: "2-digit",
					})}
				</span>
			</div>
			<div className="flex flex-col gap-1 px-4 py-2">
				<span className="text-lg">{title}</span>
				<span className="text-sm">{location}</span>
				<span className="text-sm">
					{times[0].time
						.toLocaleTimeString(dateLocale, {
							hour: "numeric",
							minute: "2-digit",
							hour12: true,
						})
						.toUpperCase()}
				</span>
			</div>
		</div>
	);
} as ModeledVoidComponent<ScheduleItemModel>;

export default ScheduleItem;
