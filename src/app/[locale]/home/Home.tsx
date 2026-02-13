"use client";

import ReadingsOrnament from "@/public/ui/ornament_1.svg";
import LatestNewsOrnament from "@/public/ui/ornament_11.svg";
import HymnsOrnament from "@/public/ui/ornament_9.svg";
import { useRouter } from "@/src/i18n/navigation";
import HymnsModal from "@/src/lib/component/hymns-modal/HymnsModal";
import { useLoadingBarRouter } from "@/src/lib/component/loading-bar/navigation";
import NewsArticlePreview from "@/src/lib/component/news-article-preview/NewsArticlePreview";
import ScheduleItem from "@/src/lib/component/schedule-item/ScheduleItem";
import SplashScreen from "@/src/lib/component/splash-screen/SplashScreen";
import { useHome } from "@/src/lib/model-implementation/home";
import { hymnsModalVIInterface } from "@/src/lib/model-implementation/hymns-modal";
import { subscribeToMailingList } from "@/src/lib/server-action/home";
import { georgia } from "@/src/lib/third-party/fonts";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { toZonedTime } from "date-fns-tz";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useLayoutEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./home.css";

type MailingListStatus = "subscribed" | "not_subscribed" | "pending";

export default function Home() {
	const { modelView } = useHome();
	const router = useLoadingBarRouter(useRouter);
	const t = useTranslations("home");
	const tLinks = useTranslations("links");
	const tQuote = useTranslations("quote");
	const tCaptions = useTranslations("imageCaptions");
	const locale = useLocale();
	const dateLocale = locale == "en" ? "en-uk" : "ru-RU";
	const hymnsModal = useInitializedStatefulInteractiveModel(
		hymnsModalVIInterface(),
		{ isOpen: false, hymns: [] },
	);
	const [mailingListStatus, setMailingListStatus] =
		useState<MailingListStatus>("not_subscribed");
	const [splashExited, setSplashExited] = useState(false);
	const subscribe = useCallback((email: string) => {
		subscribeToMailingList(email)
			.then(() => {
				setMailingListStatus("subscribed");
			})
			.catch(error => {
				console.error(error);
				alert(error);
				setMailingListStatus("not_subscribed");
			});
	}, []);

	useLayoutEffect(() => {
		window.history.scrollRestoration = "manual";
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<SplashScreen
				model={newReadonlyModel({
					isShown: !modelView,
					exitedCallback: () => setSplashExited(true),
				})}
			/>
			<main
				className={`home bg-[linear-gradient(135deg,#F7DAC1,whitesmoke)] ${!modelView && "visible"}`}
			>
				<section className="hero bg-gray-950 text-black bg-[url(/ui/nativity-icon.jpg)] bg-cover bg-center bg-no-repeat md:bg-size-[100%] md:bg-position-[60%_85%]">
					<motion.div
						animate={
							splashExited && {
								backgroundColor: [
									"rgba(0,0,0,0)",
									"rgba(0,0,0,0.75)",
								],
							}
						}
						viewport={{ once: true }}
						transition={{ duration: 0.4, ease: "easeOut" }}
						className="hero-content flex flex-col justify-center items-center md:flex-row h-[76vh] md:h-[max(30em,78vh)] lg:h-[81vh] p-8 lg:p-20 md:bg-none md:items-center"
					>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={
								splashExited && {
									opacity: 1,
									y: 0,
								}
							}
							viewport={{ once: true }}
							transition={{ duration: 0.4, ease: "easeOut" }}
							className={`${!modelView && "hidden"} hero-message flex flex-col w-full md:w-[35em] md:max-w-1/2 lg:w-full gap-5 md:p-8 justify-center`}
						>
							<span
								className={`heading ${locale == "en" ? "text-7xl" : "text-6xl"} ${georgia.className} wrap-break-word hyphens-auto text-white`}
							>
								{t("heroTitle")}
							</span>
							<hr className="my-4 text-gray-300" />
							<span className={`text-lg text-gray-300`}>
								{t("heroSubtitle")}
							</span>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={
								splashExited && {
									opacity: 1,
									y: 0,
								}
							}
							viewport={{ once: true }}
							transition={{ ease: "easeOut" }}
							className={`${!modelView && "md:hidden"} hero-icon md:flex md:w-1/2 hidden justify-center items-center`}
						>
							<Image
								className="h-[21.333em] w-[16em] hover:cursor-pointer hover:scale-[1.03] active:scale-[1.03] transition ease-out duration-200"
								onClick={() => {
									window.open(
										"/ui/nativity-icon.jpg",
										"_blank",
									);
								}}
								src="/ui/nativity-icon.jpg"
								alt={tCaptions("iconOfTheNativity")}
								title={tCaptions("iconOfTheNativity")}
								height={400}
								width={300}
								loading="eager"
							/>
						</motion.div>
					</motion.div>
				</section>
				<section className="readings text-black border-t-15 border-t-[#976029] bg-[url(/ui/ornament_3_tr.svg)] bg-no-repeat bg-size-[13em,60em] md:bg-size-[30em,80em] bg-position-[98%_0.5%,40%_-30em] lg:bg-position-[100%_0.5%,750%_-40em]">
					<div className="readings-content flex flex-col gap-6 p-8 py-9 lg:px-20 md:py-10 max-w-360">
						<span
							className={`text-[2.75rem]/tight w-3/4 mb-2 font-semibold md:text-black md:w-1/2 ${georgia.className}`}
						>
							{t("dailyReadingsHeader")}
							<hr className="mt-4 mb-0 md:w-full" />
						</span>
						{modelView?.dailyReadings ? (
							<>
								{hymnsModal.modelView && (
									<HymnsModal
										model={{
											modelView: hymnsModal.modelView,
											interact: hymnsModal.interact,
										}}
									/>
								)}
								<div className="flex flex-col gap-y-6 md:gap-y-8 gap-x-8 lg:flex-row">
									<motion.div
										initial={{ opacity: 0, y: 50 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.1 }}
										transition={{
											ease: "easeOut",
										}}
										className="daily-saints flex md:flex-row md:h-fit items-stretch bg-[#FEF8F3] border text-black border-gray-900/20 rounded-lg overflow-clip"
									>
										<div className="md:flex min-w-60 w-60 lg:min-w-60 lg:w-60 items-stretch justify-center p-2 hidden bg-gray-800">
											<Image
												className="grow object-cover object-center hover:cursor-pointer hover:scale-[1.02] active:scale-[1.02] transition ease-out duration-200"
												height={364}
												width={240}
												alt={
													modelView.dailyReadings
														.iconOfTheDay.about ??
													tCaptions("iconOfTheDay")
												}
												title={
													modelView.dailyReadings
														.iconOfTheDay.about ??
													tCaptions("iconOfTheDay")
												}
												placeholder={
													modelView.dailyReadings
														.iconOfTheDay
														.placeholder && "blur"
												}
												blurDataURL={
													modelView.dailyReadings
														.iconOfTheDay
														.placeholder
												}
												src={
													modelView.dailyReadings
														.iconOfTheDay.source
												}
												onClick={() => {
													window.open(
														modelView.dailyReadings
															.iconOfTheDay
															.source,
														"_blank",
													);
												}}
											/>
										</div>
										<div className="info flex flex-col grow">
											<div className="texts flex flex-col md:justify-center grow gap-4 py-6 [&_a]:underline [&_a]:hover:text-[#DCB042]">
												<span
													className={`text-2xl px-5 md:px-7`}
												>
													{toZonedTime(
														modelView.dailyReadings
															.currentDate,
														"CAT",
													).toLocaleDateString(
														dateLocale,
														{
															dateStyle: "full",
														},
													)}
												</span>
												<div className="flex flex-col gap-2">
													<span className="text-xl px-5 md:px-7">
														{
															modelView
																.dailyReadings
																.liturgicalWeek
														}
													</span>
													<button
														className="flex gap-2 items-center p-1 px-5 md:px-7 my-2 bg-[#250203]/82 text-[#FEF8F3] text-left hover:bg-[#250203]/92 active:bg-[#250203]"
														onClick={async () =>
															await hymnsModal.interact(
																{
																	type: "OPEN",
																	input: {
																		hymns: modelView
																			.dailyReadings
																			.hymns,
																	},
																},
															)
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
																__html: modelView
																	.dailyReadings
																	.saints,
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
												{
													modelView.dailyReadings
														.fastingInfo
												}
											</span>
										</div>
										<div className="flex p-6 md:px-10 lg:px-6 bg-gray-700 text-white [&_a]:underline [&_a]:hover:underline [&_a]:hover:text-[#DCB042] max-h-[15em] min-h-[9em] md:max-h-[11em]">
											<div className="scriptures grow flex flex-col gap-1 pr-3 overflow-y-auto">
												{[
													...modelView.dailyReadings.scriptures.map(
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
				<section className="daily-thought  border-t-15 border-b-15 border-t-gray-900/85 border-b-[#250203]/85">
					{modelView?.dailyQuote && (
						<div className="daily-thought-content flex items-center p-8 py-14 md:p-20 min-h-[25em] bg-[#0a0a0a] md:bg-[linear-gradient(to_right,#0a0a0a,transparent),url(/ui/daily-thought.jpg)] text-white bg-no-repeat bg-contain bg-right">
							<div
								className={`quote-box flex flex-col gap-4 items-center md:w-1/2`}
							>
								<p className="quote font-light text-lg/relaxed">
									<span>{tQuote("openingQuote")}</span>
									{modelView.dailyQuote.quote}
									<span>{tQuote("closingQuote")}</span>
								</p>
								<span className="author font-light w-full text-right">
									— {modelView.dailyQuote.author}
									{modelView.dailyQuote.source &&
										`, ${modelView.dailyQuote.source}`}
								</span>
							</div>
						</div>
					)}
				</section>
				{modelView && (
					<section className="news pt-4 text-black">
						<div className="ornament flex justify-center items-center mb-4 md:mb-0 w-full ">
							<LatestNewsOrnament
								className="h-[6em] w-[25em] max-w-9/10"
								fill="#88815899"
							/>
						</div>
						<div className="news-content flex flex-col gap-8">
							<span
								className={`px-8 lg:px-20 text-[2.75rem]/tight w-full mb-2 font-semibold md:text-black md:w-1/2 ${georgia.className}`}
							>
								{t("latestNewsHeader")}
								<hr className="mt-4 mb-0 md:w-full" />
							</span>
							<div className="flex flex-row flex-wrap lg:justify-between gap-x-12 gap-y-6 px-8 pb-6 lg:px-20">
								<motion.div
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.1 }}
									transition={{
										ease: "easeOut",
									}}
									className="featured flex flex-col gap-4 md:max-w-1/2 lg:max-w-[45%]"
								>
									<span className="text-xl">
										{t("featured")}
									</span>
									<NewsArticlePreview
										model={newReadonlyModel({
											isFeatured: true,
											articlePreview:
												modelView.newsArticles
													.featuredArticle,
										})}
									/>
								</motion.div>
								<motion.div
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.1 }}
									transition={{
										ease: "easeOut",
									}}
									className="schedule flex flex-col gap-4 flex-1 lg:max-w-5/10 "
								>
									<span className="text-xl">
										{t("schedule")}
									</span>
									<div className="schedule-list flex flex-col w-full gap-4 pr-3 lg:pr-6 max-h-[25em] lg:max-h-[28em] overflow-y-auto">
										<ScheduleItem
											model={newReadonlyModel({
												scheduleItem:
													modelView.scheduleItems[0],
												isFeatured: true,
											})}
										/>
										<hr className="my-2 text-black/50" />
										<div className="flex flex-col gap-3 lg:w-3/4">
											{modelView.scheduleItems
												.slice(1)
												.map((scheduleItem, index) => (
													<ScheduleItem
														key={index}
														model={newReadonlyModel(
															{
																scheduleItem,
																isFeatured: false,
															},
														)}
													/>
												))}
										</div>
									</div>
								</motion.div>
							</div>
							<div className="other-stories flex flex-col gap-4 pt-10 pb-15 px-8 lg:px-20 bg-white/70 border-t-2 border-t-[#dcb042]">
								<span className="text-xl mb-1">
									{t("moreNews")}
								</span>
								<div className="grid md:grid-cols-2 gap-8 md:gap-6 md:w-95/100 lg:w-85/100">
									{[
										...modelView.newsArticles
											.otherNewsArticles,
									].map((articlePreview, index) => (
										<NewsArticlePreview
											key={index}
											model={newReadonlyModel({
												isFeatured: false,
												articlePreview,
											})}
										/>
									))}
								</div>
							</div>
						</div>
					</section>
				)}
				<section
					id="resources"
					className="resources bg-gray-900 text-white"
				>
					<div className="h-3.75 w-full bg-[#250203] bg-[url(/ui/border-8.jpg)] bg-position-[50%_50%] bg-size-[25%] md:bg-size-[15%] lg:bg-size-[15%] bg-repeat-x" />
					<div className="resources-content flex flex-col gap-8 p-8 py-14 lg:p-20">
						<div className="flex flex-col gap-6 w-full justify-center items-center md:flex-row">
							<div className="flex md:size-[22em] w-full h-[22em] bg-[linear-gradient(to_bottom,transparent,black),url(/ui/liturgical-resources.jpg)] bg-cover bg-center bg-no-repeat rounded-lg overflow-clip border border-black/70 text-white hover:text-[#dcb042] hover:scale-[1.03] active:border-[#dcb042] active:text-[#dcb042] active:scale-[1.03] transition ease-out duration-200 select-none">
								<div
									className="flex size-full p-6 justify-center items-end text-center hover:cursor-pointer"
									onClick={() =>
										window.open(
											tLinks("liturgicalResources"),
											"_blank",
										)
									}
								>
									<span className={`text-3xl mb-3`}>
										{t("liturgicalResources")}
									</span>
								</div>
							</div>
							<div className="flex md:size-[22em] w-full h-[22em] bg-[linear-gradient(to_bottom,transparent,black),url(/ui/what-is-orthodoxy.jpg)] bg-cover bg-center bg-no-repeat rounded-lg overflow-clip border border-black/70 text-white hover:text-[#dcb042] hover:scale-[1.03]  active:border-[#dcb042] active:text-[#dcb042] active:scale-[1.03] transition ease-out duration-200 select-none">
								<div
									className="flex size-full p-6 justify-center items-end text-center hover:cursor-pointer"
									onClick={() =>
										window.open(
											tLinks("whatIsOrthodoxy"),
											"_blank",
										)
									}
								>
									<span className={`text-3xl mb-3`}>
										{t("whatIsOrthodoxy")}
									</span>
								</div>
							</div>
							<div className="flex md:size-[22em] w-full h-[22em] bg-[linear-gradient(to_bottom,transparent,black),url(/ui/about-our-parish.jpg)] bg-cover bg-center bg-no-repeat rounded-lg overflow-clip border border-black/70 text-white hover:text-[#dcb042] hover:scale-[1.03]  active:border-[#dcb042] active:text-[#dcb042] active:scale-[1.03] transition ease-out duration-200 select-none">
								<div
									className="flex size-full p-6 justify-center items-end text-center hover:cursor-pointer"
									onClick={() =>
										router.push("/about-us", {
											locale,
											scroll: true,
										})
									}
								>
									<span className={`text-3xl mb-3`}>
										{t("aboutOurParish")}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="h-3.75 w-full bg-[#250203] bg-[url(/ui/border-8.jpg)] bg-position-[50%_50%] bg-size-[25%] md:bg-size-[15%] lg:bg-size-[15%] bg-repeat-x" />
				</section>
				<section id="media" className="gallery text-black">
					{modelView && (
						<div className="gallery-content flex flex-col gap-8 p-8 px-4 py-14 lg:px-10">
							<div className="swiper-container w-full max-w-full h-[23em] md:h-[20em] lg:h-[23em] max-h-[23em]">
								<Swiper
									className="h-full"
									modules={[Navigation, Autoplay]}
									spaceBetween={20}
									breakpoints={{
										768: {
											slidesPerView: 3,
										},
									}}
									slidesPerView={"auto"}
									navigation
									autoplay
								>
									{[
										...modelView.dailyGalleryImages.map(
											(galleryImage, index) => (
												<SwiperSlide key={index}>
													<div className="flex justify-stretch items-stretch w-full h-full rounded-lg overflow-clip">
														<Image
															className="grow object-cover object-center"
															src={
																galleryImage
																	.image
																	.source
															}
															alt={
																galleryImage
																	.image
																	.about ??
																tCaptions(
																	"galleryImage",
																)
															}
															title={
																galleryImage
																	.image.about
															}
															placeholder="blur"
															blurDataURL={
																galleryImage
																	.image
																	.placeholder
															}
															width={480}
															height={320}
														/>
													</div>
												</SwiperSlide>
											),
										),
									]}
								</Swiper>
							</div>
						</div>
					)}
				</section>
				<section className="mailing-list bg-gray-900 text-white">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ ease: "easeOut" }}
						className="mailing-list-content flex flex-col gap-8 p-8 py-14 md:w-3/4 lg:w-6/10 lg:px-20"
					>
						<span
							className={`text-[2.75rem]/tight w-3/4 mb-2 font-semibold ${georgia.className} wrap-break-word hyphens-auto`}
						>
							{t("mailingListHeader")}
							<hr className="mt-4 mb-0 md:w-full" />
						</span>
						{mailingListStatus != "subscribed" ? (
							<div className="flex flex-col gap-8">
								<p>{t("mailingListDescription")}</p>
								<form
									action={formData => {
										subscribe(
											formData
												.get("email")!
												.toString()
												.trim(),
										);
									}}
									onSubmit={() => {
										setMailingListStatus("pending");
									}}
								>
									<div className="flex flex-nowrap items-stretch text-black rounded-lg overflow-clip">
										<input
											className="grow p-4 bg-[whitesmoke] w-full"
											type="email"
											placeholder="you@example.com"
											name="email"
											id="mailing-email"
											required
											autoComplete="email"
										/>
										<button
											className={`p-4 min-w-fit w-fit h-full md:w-[8em] bg-gray-600 text-white text-center disabled:bg-gray-400 hover:bg-gray-700 active:bg-gray-950`}
											type="submit"
											disabled={
												mailingListStatus == "pending"
											}
										>
											{t("mailingListButton")}
										</button>
									</div>
								</form>
							</div>
						) : (
							<div>
								<p className="text-xl">
									{t("mailingListSuccessMessage")}
								</p>
							</div>
						)}
					</motion.div>
				</section>
			</main>
		</>
	);
}
