"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { ScheduleItemModel } from "../../model/schedule-item";
import { georgia } from "../../third-party/fonts";
import { useLocale } from "next-intl";
import { toZonedTime } from "date-fns-tz";
import { FeaturedItemOrnament } from "../miscellaneous/graphic";

const ScheduleItem = function ({ model }) {
	const { scheduleItem, isFeatured } = model.modelView;
	const { date: rawDate, location, times: rawTimes, title } = scheduleItem;
	const locale = useLocale();
	const dateLocale = locale == "en" ? "en-uk" : "ru-RU";
	const date = toZonedTime(rawDate, "Africa/Harare");
	const times = rawTimes.map(time => ({
		...time,
		time: toZonedTime(time.time, "Africa/Harare"),
	}));
	
	console.log(rawTimes)

	return isFeatured ? (
		<div className="featured-schedule-item flex min-h-fit bg-[#FEF8F3] border border-gray-900/20 rounded-lg overflow-clip">
			<div
				className={`grow self-stretch flex flex-col min-w-24 max-w-25 gap-2 items-center text-center p-4 px-5 bg-gray-900 text-white ${georgia.className}`}
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
			<div className="flex flex-col py-4 px-5.5 gap-1">
				<span className="text-xl">{title}</span>
				<span>{location}</span>
				{times.map((time, index) => (
					<div key={index} className="text-sm inline-flex gap-1">
						<span className="w-17">
							{time.time
								.toLocaleTimeString(dateLocale, {
									hour: "numeric",
									minute: "2-digit",
									hour12: true,
								})
								.toUpperCase()}
						</span>
						{/* <span className="mr-1">{"—"}</span> */}
						<span className="underline">{time.designation}</span>
					</div>
				))}
			</div>
		</div>
	) : (
		<div className="schedule-item flex items-center bg-[#FEF8F3] border border-gray-900/20 rounded-lg overflow-clip">
			<div
				className={`grow self-stretch flex flex-col w-full max-w-[5em] gap-1 items-center text-center p-4 bg-gray-900 text-white ${georgia.className}`}
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
			<div className="flex flex-col py-2 px-4 gap-1">
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
