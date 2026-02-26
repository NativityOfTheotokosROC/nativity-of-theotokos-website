import { ModeledVoidComponent } from "@mvc-react/components";
import { DailySaintsWidgetModel } from "../../model/daily-saints-widget";
import Image from "next/image";
import { toZonedTime } from "date-fns-tz";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { HymnsOrnament } from "../miscellaneous/graphic";

const DailySaintsWidget = function ({ model }) {
	const { details, hymnsModal } = model.modelView;
	const { currentDate, iconOfTheDay, liturgicalWeek, saints, hymns } =
		details;
	const locale = useLocale();
	const dateLocale = locale == "en" ? "en-uk" : "ru-RU";
	const t = useTranslations("home");
	const tCaptions = useTranslations("imageCaptions");

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.1 }}
			transition={{
				ease: "easeOut",
			}}
			className="daily-saints flex md:flex-row md:h-fit md:max-h-[26em] items-stretch bg-[#FEF8F3] border text-black border-gray-900/20 rounded-lg overflow-clip"
		>
			<div className="hidden md:flex min-w-60 w-60 lg:min-w-60 lg:w-60 items-stretch justify-stretch p-2 bg-gray-800">
				<Image
					className="grow max-h-full object-cover object-top hover:cursor-pointer hover:scale-[1.02] active:scale-[1.02] transition ease-out duration-200"
					height={364}
					width={240}
					alt={iconOfTheDay.about ?? tCaptions("iconOfTheDay")}
					title={iconOfTheDay.about ?? tCaptions("iconOfTheDay")}
					placeholder={iconOfTheDay.placeholder && "blur"}
					blurDataURL={iconOfTheDay.placeholder}
					src={iconOfTheDay.source}
					onClick={() => {
						window.open(iconOfTheDay.source, "_blank");
					}}
				/>
			</div>
			<div className="texts flex flex-col md:justify-center grow gap-4 py-6 [&_a]:underline [&_a]:hover:text-[#DCB042]">
				<span className={`text-2xl px-5 md:px-7`}>
					{toZonedTime(currentDate, "Africa/Harare").toLocaleDateString(
						dateLocale,
						{
							dateStyle: "full",
						},
					)}
				</span>
				<div className="flex flex-col gap-2 grow">
					<span className="text-xl px-5 md:px-7">
						{liturgicalWeek}
					</span>
					<button
						className="flex gap-2 items-center p-1 px-5 md:px-7 my-2 bg-[#250203]/82 text-[#FEF8F3] text-left hover:bg-[#250203]/92 active:bg-[#250203]"
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
					<div className="grow px-5 md:px-7 h-[15em] max-h-[15em] md:h-[10em]">
						<p
							className={`max-h-full text-base/relaxed [&_a]:text-red-900 pr-3 overflow-y-auto`}
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
