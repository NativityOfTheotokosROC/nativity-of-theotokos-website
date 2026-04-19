import { ModeledVoidComponent } from "@mvc-react/components";
import { DailySaintsWidgetModel } from "../../models/daily-saints-widget";
import Image from "next/image";
import { toZonedTime } from "date-fns-tz";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import HymnsOrnament from "@/public/assets/ornament_9.svg";
import Link from "next/link";
import { getLocalTimeZone } from "../../utilities/date-time";

const DailySaintsWidget = function ({ model }) {
	const { details, hymnsModal } = model.modelView;
	const { currentDate, iconOfTheDay, liturgicalWeek, saints, hymns } =
		details;
	const locale = useLocale();
	const t = useTranslations("home");
	const tCaptions = useTranslations("imageCaptions");
	const dateString = toZonedTime(
		currentDate,
		getLocalTimeZone(),
	).toLocaleDateString(locale === "en" ? "en-uk" : "ru-RU", {
		dateStyle: "full",
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.1 }}
			transition={{
				ease: "easeOut",
			}}
			className="daily-saints flex items-stretch overflow-clip rounded-lg border border-gray-900/20 bg-[#FEF8F3] text-black md:h-fit md:max-h-[26em] md:flex-row"
		>
			<div className="hidden w-60 min-w-60 items-stretch justify-stretch bg-gray-800 p-2 md:flex lg:w-60 lg:min-w-60">
				<Link
					className="contents"
					href={iconOfTheDay.source}
					target="_blank"
				>
					<Image
						className="h-full max-h-full min-w-full grow object-cover object-top transition duration-200 ease-out hover:scale-[1.02] hover:cursor-pointer active:scale-[1.02]"
						height={364}
						width={240}
						alt={iconOfTheDay.about ?? tCaptions("iconOfTheDay")}
						title={iconOfTheDay.about ?? tCaptions("iconOfTheDay")}
						placeholder={iconOfTheDay.placeholder && "blur"}
						blurDataURL={iconOfTheDay.placeholder}
						src={iconOfTheDay.source}
					/>
				</Link>
			</div>
			<div className="texts flex grow flex-col gap-4 py-6 md:justify-center [&_a]:underline [&_a]:hover:text-[#DCB042]">
				<span className={`px-5 text-2xl md:px-7`}>{dateString}</span>
				<div className="flex grow flex-col gap-2">
					<span className="px-5 text-xl md:px-7">
						{liturgicalWeek}
					</span>
					<button
						className="my-2 flex items-center gap-2 bg-[#250203]/82 p-1 px-5 text-left text-[#FEF8F3] hover:bg-[#250203]/92 active:bg-[#250203] md:px-7"
						onClick={async () =>
							await hymnsModal.interact({
								type: "OPEN",
								input: {
									hymns,
								},
							})
						}
					>
						<HymnsOrnament className="h-10 w-10 fill-[#FEF8F3]" />
						<span className="text-lg underline">
							{t("dailyHymns")}
						</span>
					</button>
					<div className="h-[15em] max-h-[15em] grow px-5 md:h-[10em] md:px-7">
						<p
							className={`max-h-full overflow-y-auto pr-3 text-base/relaxed [&_a]:text-red-900`}
							dangerouslySetInnerHTML={{
								__html: saints,
							}}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	);
} satisfies ModeledVoidComponent<DailySaintsWidgetModel>;

export default DailySaintsWidget;
