import {
	HymnsOrnament,
	ReadingsOrnament,
} from "@/src/lib/component/miscellaneous/graphic";
import { DailyReadingsSectionModel } from "@/src/lib/model/daily-readings-section";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { toZonedTime } from "date-fns-tz";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
const DailyReadingsSection = function ({ model }) {
	const { dailyReadings, hymnsModal } = model.modelView;
	const locale = useLocale();
	const dateLocale = locale == "en" ? "en-uk" : "ru-RU";
	const t = useTranslations("home");
	const tCaptions = useTranslations("imageCaptions");

	return (
		<section className="readings text-black border-t-15 border-t-[#976029] bg-[url(/ui/ornament_3_tr.svg)] bg-no-repeat bg-size-[13em,60em] md:bg-size-[30em,80em] bg-position-[98%_0.5%,40%_-30em] lg:bg-position-[100%_0.5%,750%_-40em]">
			<div className="readings-content flex flex-col gap-6 p-8 py-9 lg:px-20 md:py-10 max-w-360">
				<span
					className={`text-[2.75rem]/tight w-3/4 mb-2 font-semibold md:text-black md:w-1/2 ${georgia.className}`}
				>
					{t("dailyReadingsHeader")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				{dailyReadings ? (
					<>
						<div className="flex flex-col gap-y-6 md:gap-y-8 gap-x-8 lg:flex-row">
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.1 }}
								transition={{
									ease: "easeOut",
								}}
								className="daily-saints flex md:flex-row md:h-fit md:max-h-[max(fit-content,24.5em)] items-stretch bg-[#FEF8F3] border text-black border-gray-900/20 rounded-lg overflow-clip"
							>
								<div className="md:flex max-h-full min-w-60 w-60 lg:min-w-60 lg:w-60 items-stretch justify-center p-2 hidden bg-gray-800">
									<Image
										className="grow object-cover object-center hover:cursor-pointer hover:scale-[1.02] active:scale-[1.02] transition ease-out duration-200"
										height={364}
										width={240}
										alt={
											dailyReadings.iconOfTheDay.about ??
											tCaptions("iconOfTheDay")
										}
										title={
											dailyReadings.iconOfTheDay.about ??
											tCaptions("iconOfTheDay")
										}
										placeholder={
											dailyReadings.iconOfTheDay
												.placeholder && "blur"
										}
										blurDataURL={
											dailyReadings.iconOfTheDay
												.placeholder
										}
										src={dailyReadings.iconOfTheDay.source}
										onClick={() => {
											window.open(
												dailyReadings.iconOfTheDay
													.source,
												"_blank",
											);
										}}
									/>
								</div>
								<div className="info flex flex-col grow">
									<div className="texts flex flex-col md:justify-center md:min-h-fit grow gap-4 py-6 [&_a]:underline [&_a]:hover:text-[#DCB042]">
										<span
											className={`text-2xl px-5 md:px-7`}
										>
											{toZonedTime(
												dailyReadings.currentDate,
												"CAT",
											).toLocaleDateString(dateLocale, {
												dateStyle: "full",
											})}
										</span>
										<div className="flex flex-col gap-2">
											<span className="text-xl px-5 md:px-7">
												{dailyReadings.liturgicalWeek}
											</span>
											<button
												className="flex gap-2 items-center p-1 px-5 md:px-7 my-2 bg-[#250203]/82 text-[#FEF8F3] text-left hover:bg-[#250203]/92 active:bg-[#250203]"
												onClick={async () =>
													await hymnsModal.interact({
														type: "OPEN",
														input: {
															hymns: dailyReadings.hymns,
														},
													})
												}
											>
												<HymnsOrnament className="h-10 w-10 fill-[#FEF8F3]" />
												<span className="text-lg underline">
													{t("dailyHymns")}
												</span>
											</button>
											<div className="px-5 md:px-7 max-h-[15em] md:max-h-[10em]">
												<p
													className={`h-full text-base/relaxed [&_a]:text-red-900 pr-3 overflow-y-auto`}
													dangerouslySetInnerHTML={{
														__html: dailyReadings.saints,
													}}
												/>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.1 }}
								transition={{
									ease: "easeOut",
								}}
								className="scripture-readings h-fit flex flex-col bg-[#FEF8F3] border border-gray-900/30 md:max-w-[70%] lg:min-w-[35%] rounded-lg overflow-clip"
							>
								<div className="flex gap-6 w-full items-center justify-center lg:justify-center md:items-center lg:items-center p-2 px-10 text-white bg-gray-900">
									<ReadingsOrnament
										className={`object-contain object-center h-[5em] w-[8em]`}
										fill="#fff"
										opacity={0.9}
									/>
									<span
										className={`grow w-full hidden md:inline lg:hidden text-4xl ${georgia.className}`}
									>
										{t("readings")}
									</span>
								</div>
								<div className="fasting-info bg-gray-950 text-white text-center md:text-left lg:text-center p-2.5 px-4 md:px-10 md:mt-0">
									<span className="text-base">
										{dailyReadings.fastingInfo}
									</span>
								</div>
								<div className="flex p-6 md:px-10 lg:px-6 bg-gray-700 text-white [&_a]:underline [&_a]:hover:underline [&_a]:hover:text-[#DCB042] max-h-[15em] min-h-[9em] md:max-h-[11em]">
									<div className="scriptures grow flex flex-col gap-1 pr-3 overflow-y-auto">
										{[
											...dailyReadings.scriptures.map(
												(scripture, index) => (
													<div
														key={index}
														className="grid grid-cols-2 gap-x-4"
													>
														<span className="w-fit">
															<Link
																href={
																	scripture.link
																}
																target="_blank"
															>
																{
																	scripture.scriptureText
																}
															</Link>
														</span>
														{scripture.designation && (
															<span className="wrap-break-word hyphens-auto">
																{
																	scripture.designation
																}
															</span>
														)}
													</div>
												),
											),
										]}
									</div>
								</div>
							</motion.div>
						</div>
					</>
				) : (
					<div className="flex md:flex-row gap-2 animate-pulse h-[20em] lg:w-9/10 md:mt-4 items-stretch">
						<div className="md:flex min-w-60 w-60 lg:min-w-70 lg:w-70 items-stretch justify-center p-3 hidden bg-black/20" />
						<div className="info flex flex-col grow bg-black/20" />
					</div>
				)}
			</div>
		</section>
	);
} satisfies ModeledVoidComponent<DailyReadingsSectionModel>;

export default DailyReadingsSection;
