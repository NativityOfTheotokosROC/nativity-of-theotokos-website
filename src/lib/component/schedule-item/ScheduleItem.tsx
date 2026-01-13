import { ModeledVoidComponent } from "@mvc-react/components";
import { ScheduleItemModel } from "../../model/schedule-item";

const ScheduleItem = function ({ model }) {
	const { scheduleItem, isFeatured } = model.modelView;
	const { date, location, times, title } = scheduleItem;

	return isFeatured ? (
		<div className="featured-schedule-item flex items-center bg-[#FEF8F3] border border-gray-900/20">
			<div className="grow self-stretch flex flex-col max-w-fit gap-2 items-center text-center p-4 px-5 bg-gray-900 text-white font-serif">
				<span className="text-4xl">
					{date.toLocaleDateString("default", { day: "2-digit" })}
				</span>
				<span className="uppercase">
					{date.toLocaleDateString("default", {
						month: "short",
						year: "2-digit",
					})}
				</span>
			</div>
			<div className="flex flex-col py-3 px-6 gap-1">
				<span className="text-xl">{title}</span>
				<span>{location}</span>
				{times.map((time, index) => (
					<span key={index} className="text-sm">
						{time.time.toLocaleTimeString("default", {
							hour: "2-digit",
							minute: "2-digit",
						})}{" "}
						— {time.designation}
					</span>
				))}
			</div>
		</div>
	) : (
		<div className="schedule-item flex items-center bg-[#FEF8F3] border border-gray-900/20">
			<div className="grow self-stretch flex flex-col max-w-fit gap-1 items-center text-center p-4 bg-gray-900 text-white font-serif">
				<span className="text-xl">
					{date.toLocaleDateString("default", { day: "2-digit" })}
				</span>
				<span className="text-xs uppercase">
					{date.toLocaleDateString("default", {
						month: "short",
						year: "2-digit",
					})}
				</span>
			</div>
			<div className="flex flex-col py-2 px-4">
				<span className="text-base">{title}</span>
				<span className="text-sm">{location}</span>
				<span className="text-xs">
					{times[0].time.toLocaleTimeString("default", {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
			</div>
		</div>
	);
} as ModeledVoidComponent<ScheduleItemModel>;

export default ScheduleItem;
