"use client";

import Image from "next/image";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { subscribeToMailingList } from "@/src/lib/server-actions/home";
import { useCallback, useLayoutEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import Link from "next/link";
import { useHome } from "@/src/lib/model-implementation/home";
import ScheduleItem from "@/src/lib/component/schedule-item/ScheduleItem";
import { newReadonlyModel } from "@mvc-react/mvc";
import NewsArticlePreview from "@/src/lib/component/news-article-preview/NewsArticlePreview";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { hymnsModalVIInterface } from "@/src/lib/model-implementation/hymns-modal";
import HymnsModal from "@/src/lib/component/hymns-modal/HymnsModal";
import SplashScreen from "@/src/lib/component/splash-screen/SplashScreen";
import { motion } from "motion/react";
import ReadingsOrnament from "@/public/ornament_1.svg";
import HymnsOrnament from "@/public/ornament_9.svg";
import LatestNewsOrnament from "@/public/ornament_11.svg";
import { georgia } from "@/src/lib/third-party/fonts";
import "./home.css";

type MailingListStatus = "subscribed" | "not_subscribed" | "pending";

export default function Home() {
	const { modelView } = useHome();
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
				<section className="hero bg-[#DCB042] text-black bg-[url(/nativity-icon.webp)] bg-cover bg-center bg-no-repeat md:bg-size-[100%] md:bg-position-[60%_85%]">
					<div className="hero-content flex flex-col justify-center items-center md:flex-row h-[75vh] md:h-[30em] p-8 lg:p-20 bg-black/70 md:bg-none md:items-center">
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{
								opacity: splashExited ? 1 : 0,
								y: splashExited ? 0 : 10,
							}}
							viewport={{ once: true }}
							transition={{ duration: 0.4, ease: "easeOut" }}
							className={`${!modelView && "hidden"} hero-message flex flex-col md:w-[35em] md:max-w-1/2 lg:w-full gap-5 md:p-8 justify-center`}
						>
							<span
								className={`heading text-7xl ${georgia.className} text-white`}
							>
								Hello and welcome
							</span>
							<hr className="my-4 text-gray-300" />
							<span className={`text-lg text-gray-300`}>
								Official website of the Nativity of the
								Theotokos parish of the Russian Orthodox Church
								in Zimbabwe. (est. 2025)
							</span>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{
								opacity: splashExited ? 1 : 0,
								y: splashExited ? 0 : 10,
							}}
							viewport={{ once: true }}
							transition={{ ease: "easeOut" }}
							className={`${!modelView && "md:hidden"} hero-icon md:flex md:w-1/2 hidden justify-center items-center`}
						>
							<Image
								className="h-[20em] w-[15em]"
								src="/nativity-icon.webp"
								alt="Icon of the Nativity of the Theotokos"
								title="Icon of the Nativity of the Theotokos"
								height={400}
								width={300}
								loading="eager"
							/>
						</motion.div>
					</div>
				</section>
				<section className="readings text-black border-t-15 border-t-[#976029] bg-[url(/ornament_3_tr.svg)] bg-no-repeat bg-size-[13em,60em] md:bg-size-[30em,80em] bg-position-[98%_0.5%,40%_-30em] lg:bg-position-[100%_0.5%,750%_-40em]">
					<div className="readings-content flex flex-col gap-6 p-8 py-9 lg:px-20 md:py-10 max-w-360">
						<span
							className={`text-[2.75rem]/tight w-3/4 mb-2 font-semibold md:text-black md:w-1/2 ${georgia.className}`}
						>
							Daily Readings
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
								<div className="flex flex-col gap-y-6 gap-x-8 lg:flex-row">
									<motion.div
										initial={{ opacity: 0, y: 50 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.2 }}
										transition={{
											ease: "easeOut",
										}}
										className="daily-saints flex md:flex-row md:h-fit items-stretch bg-[#FEF8F3] border text-black border-gray-900/20 rounded-lg overflow-clip"
									>
										<div className="md:flex min-w-60 w-60 lg:min-w-60 lg:w-60 items-stretch justify-center p-2 hidden bg-gray-800">
											<Image
												className="grow object-cover object-center hover:cursor-pointer"
												height={364}
												width={240}
												alt="Icon of the day"
												title="Icon of the day"
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
													{modelView.dailyReadings.currentDate.toLocaleDateString(
														"en-uk",
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
													<div className="flex gap-2 items-center p-1 px-5 md:px-7 my-2 bg-[#250203]/80 text-white">
														<HymnsOrnament className="h-10 w-10 fill-white" />
														<Link
															className="text-lg "
															href="#"
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
															replace
														>
															{
																"Hymns for the Day"
															}
														</Link>
													</div>
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
										viewport={{ once: true, amount: 0.2 }}
										transition={{
											ease: "easeOut",
										}}
										className="scripture-readings h-fit flex flex-col bg-white/70 border border-gray-900/30 md:max-w-[70%] lg:min-w-[35%] rounded-lg overflow-clip"
									>
										<div className="flex gap-6 w-full items-center justify-center lg:justify-center md:items-center lg:items-center p-2 px-10 text-white bg-gray-900">
											<ReadingsOrnament
												className={`object-contain object-center h-[5em] w-[8em]`}
												fill="#fff"
											/>
											<span
												className={`grow w-full hidden md:inline lg:hidden text-4xl ${georgia.className}`}
											>
												Readings
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
										<div className="flex p-6 md:px-10 lg:px-6 bg-gray-700 text-white [&_a]:underline [&_a]:hover:underline [&_a]:hover:text-[#DCB042] max-h-[15em] md:max-h-[11em]">
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
																	<span>
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
						<div className="daily-thought-content flex items-center p-8 py-9 md:p-20 min-h-[25em] bg-[#0a0a0a] md:bg-[linear-gradient(to_right,#0a0a0a,transparent),url(/daily-thought-bg.jpg)] text-white bg-no-repeat bg-contain bg-right">
							<div
								className={`quote-box flex flex-col gap-4 items-center md:w-1/2`}
							>
								<p className="quote text-lg/relaxed">
									<span>“</span>
									{modelView.dailyQuote.quote}
									<span>”</span>
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
								Latest News
								<hr className="mt-4 mb-0 md:w-full" />
							</span>
							<div className="flex flex-row flex-wrap lg:justify-between gap-x-12 gap-y-6 px-8 pb-6 lg:px-20">
								<div className="featured flex flex-col gap-4 md:max-w-1/2 lg:max-w-[45%]">
									<span className="text-xl">Featured</span>
									<motion.div
										initial={{ opacity: 0, y: 50 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.15 }}
										transition={{
											ease: "easeOut",
										}}
									>
										<NewsArticlePreview
											model={newReadonlyModel({
												isFeatured: true,
												articlePreview:
													modelView.newsArticles
														.featuredArticle,
											})}
										/>
									</motion.div>
								</div>
								<div className="schedule flex flex-col gap-4 flex-1 lg:max-w-5/10 ">
									<span className="text-xl">Schedule</span>
									<motion.div
										initial={{ opacity: 0, y: 50 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.15 }}
										transition={{
											ease: "easeOut",
										}}
										className="schedule-list flex flex-col w-full gap-4 pr-3 lg:pr-6 max-h-[25em] lg:max-h-[28em] overflow-y-auto"
									>
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
									</motion.div>
								</div>
							</div>
							<div className="other-stories flex flex-col gap-4 pt-6 pb-10 px-8 lg:px-20 bg-white/70  border-t border-t-[#dcb042]">
								<span className="text-xl mb-1">More News</span>
								<div className="grid lg:grid-cols-2 gap-8 md:gap-6 md:w-3/4 lg:w-9/10">
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
					className="resources bg-[#250203] text-white"
				>
					<div className="resources-content flex flex-col gap-8 p-8 py-14 lg:px-20">
						<div className="flex flex-col gap-6 w-full justify-center items-center md:flex-row">
							<div className="flex size-[20em] bg-[linear-gradient(to_bottom,transparent,black),url(/nativity-11.jpg)] bg-cover bg-center rounded-lg overflow-clip">
								<div
									className="flex size-full p-6 justify-center items-end text-center  text-white hover:cursor-pointer"
									onClick={() =>
										window.open(
											"https://eadiocese.org/litresource",
											"_blank",
										)
									}
								>
									<span
										className={`text-3xl mb-3 ${georgia.className}`}
									>
										Liturgical Resources
									</span>
								</div>
							</div>
							<div className="flex size-[20em] bg-[linear-gradient(to_bottom,transparent,black),url(/nativity-7.jpg)] bg-cover bg-center rounded-lg overflow-clip">
								<div
									className="flex size-full p-6 justify-center items-end text-center  text-white hover:cursor-pointer"
									onClick={() =>
										window.open(
											"https://www.oca.org/orthodoxy/the-orthodox-faith",
											"_blank",
										)
									}
								>
									<span
										className={`text-3xl mb-3 ${georgia.className}`}
									>
										What is Orthodoxy?
									</span>
								</div>
							</div>
							<div className="flex size-[20em] bg-[linear-gradient(to_bottom,transparent,black),url(/nativity-9.jpg)] bg-cover bg-center rounded-lg overflow-clip">
								<div
									className="flex size-full p-6 justify-center items-end text-center  text-white hover:cursor-pointer"
									onClick={() =>
										alert("Content to be added soon!")
									}
								>
									<span
										className={`text-3xl mb-3 ${georgia.className}`}
									>
										About our Parish
									</span>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section id="media" className="gallery text-black">
					<div className="h-6 w-full bg-[#250203] bg-[url(/border-1.webp)] bg-position-[50%_50%] bg-size-[30%] md:bg-size-[10%] bg-repeat-x" />
					{modelView && (
						<div className="gallery-content flex flex-col gap-8 p-8 py-14 lg:px-20">
							<div className="swiper-container w-full max-w-full h-[20em] max-h-[20em]">
								<Swiper
									className="h-full"
									modules={[Navigation, Autoplay]}
									spaceBetween={30}
									breakpoints={{ 768: { slidesPerView: 3 } }}
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
																"gallery item"
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
					<div className="mailing-list-content flex flex-col gap-8 p-8 py-14 md:w-3/4 lg:w-6/10 lg:px-20">
						<span
							className={`text-[2.75rem]/tight w-3/4 mb-2 font-semibold ${georgia.className}`}
						>
							Join our Mailing List
							<hr className="mt-4 mb-0 md:w-full" />
						</span>
						{mailingListStatus != "subscribed" ? (
							<motion.div
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ ease: "easeOut" }}
								className="flex flex-col gap-8"
							>
								<p>
									{
										"Stay up to date with the latest church news, announcements, and events straight from your mailbox. Enter your email below and subscribe if you haven't already."
									}
								</p>
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
											Subscribe
										</button>
									</div>
								</form>
							</motion.div>
						) : (
							<div>
								<p className="text-xl">
									Thank you for subscribing to our mailing
									list! We will be keeping you up to date with
									the latest news, updates, announcements and
									more.
								</p>
							</div>
						)}
					</div>
				</section>
			</main>
		</>
	);
}
