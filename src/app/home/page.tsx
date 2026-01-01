"use client";

import Image from "next/image";
import { EB_Garamond } from "next/font/google";
import { Navigation, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import "@fortawesome/fontawesome-svg-core/styles.css";
// import { faEnvelope as Email } from "@fortawesome/free-regular-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { useCallback, useState } from "react";
import { subscribeToMailingList } from "@/src/lib/utility/server-actions";

type MailingListStatus = "subscribed" | "not_subscribed" | "pending";
const ebGaramond = EB_Garamond({ subsets: ["latin", "cyrillic"] });

export default function Home() {
	const [mailingListStatus, setMailingListStatus] =
		useState<MailingListStatus>("not_subscribed");

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

	return (
		<main className="home">
			<section className="hero bg-[#DCB042] text-black bg-[url(/nativity-icon.webp)] bg-cover bg-no-repeat md:bg-size-[100%] md:bg-position-[60%_85%]">
				<div className="hero-content flex flex-col justify-center items-center md:flex-row md:justify-start h-[30em] p-20 bg-black/70">
					<div className="hero-message flex flex-col md:w-[35em] md:max-w-3/4 gap-6 md:p-8 justify-center">
						<span
							className={`heading text-6xl font-serif text-white ${ebGaramond.className}`}
						>
							Hello and welcome
						</span>
						<hr className="my-4 text-gray-300" />
						<span
							className={`${ebGaramond.className} text-lg text-gray-300`}
						>
							Official page of the Russian Orthodox Church in
							Zimbabwe, run by its laymen, with the blessing of
							Father Dimitri Polokov
						</span>
					</div>
				</div>
			</section>
			<section className="readings bg-[antiquewhite] text-black">
				<div className="readings-content flex flex-col gap-6 p-9 lg:px-20 md:py-10">
					<span className="text-3xl font-serif md:w-1/2">
						Daily Readings
						<hr className="mt-4 mb-0" />
					</span>
					<div className="flex md:flex-row gap-6 lg:w-6/10 md:mt-4 items-center md:p-4.5 md:bg-gray-900 md:text-white">
						<Image
							className="h-[18em] min-h-full w-auto hidden md:block object-cover"
							height={320}
							width={1000}
							alt="Saint of the day"
							src="/st-nicholas.jpg"
						/>
						<div className="texts flex flex-col gap-4">
							<span className="text-2xl font-serif">
								Friday, 19 December 2025
							</span>
							<div className="flex flex-col gap-2">
								<span className="text-lg">
									28th Week After Pentecost, Tone II
								</span>
								<p className="text-sm">
									St Nicholas the Wonderworker, Abp. of Myra
									in Lycia; New Martyr Nicolas Karamos of
									Smyrna (1657); St Maximus, Metropolitan of
									Kiev & Vladimir (1305)
								</p>
							</div>
							<div className="flex flex-col">
								<span className="text-sm">
									John 10:9-16 (Matins Gospel)
								</span>
								<span className="text-sm">
									Hebrews 13:17-21 (Epistle, Saint Nicholas)
								</span>
								<span className="text-sm">
									Luke 6:17-23 (Gospel, Saint Nicholas)
								</span>
							</div>
							<span className="text-sm">
								☦ Nativity Fast | Abstain from food with oil
							</span>
						</div>
					</div>
				</div>
			</section>
			<section className="daily-thought bg-[#0a0a0a] md:bg-[linear-gradient(to_right,#0a0a0a,transparent),url(/daily-thought-bg.jpg)] text-white bg-no-repeat bg-contain bg-right">
				<div className="daily-thought-content flex items-center p-9 md:p-20 min-h-[25em]">
					<div
						className={`quote-box flex flex-col gap-4 items-center ${ebGaramond.className} md:w-1/2`}
					>
						<p className="quote text-lg">
							The Fathers speak of prayer as consisting of a
							single thought (monologistos euche). Strictly
							speaking it is not even a thought, but rather an
							awareness of being totally absorbed in the reality
							of God. One can, nevertheless, call this conscious
							experience ‘thought’, because it is not simply a
							state of confused feeling or the sensation of being
							lost in the ocean of inarticulate reality, but it is
							awareness of encounter with the personal infinity of
							God who loves us. It is the mind’s confirmation of
							the reality. I do not lose myself in this infinity,
							because it is the infinity of a personal God and of
							his love to which I respond with my love. For the
							heart is truly the place where one experiences the
							love of the other, and where one responds to the
							other. I do not lose myself, because it is the
							infinity of a personal God whose love is my delight;
							I depend on his love as I depend on his mercy, for
							face to face with him I still feel infinitely small,
							and a sinner.
						</p>
						<span className="author italic">
							— Dumitru Staniloe, Prayer and Holiness: The Icon of
							Man Renewed in God
						</span>
					</div>
				</div>
			</section>
			<section className="news bg-[antiquewhite] text-black">
				<div className="news-content flex flex-col gap-8 p-9 lg:px-20">
					<span className="text-3xl font-serif md:w-1/2">
						Latest News
						<hr className="mt-4" />
					</span>
					<div className="flex flex-row flex-wrap gap-x-12 gap-y-6">
						<div className="featured flex flex-col gap-4 md:max-w-1/2">
							<span className="uppercase">Featured</span>
							<div className="featured-card flex flex-col lg:flex-row lg:items-center lg:bg-transparent lg:text-black hover:cursor-pointer">
								<Image
									className="w-full border-gray-900 border-10 h-auto md:h-[10em] lg:min-h-[15em] lg:h-full lg:w-[13em] object-cover"
									height={500}
									width={500}
									alt="Saint of the day"
									src="/nativity.jpg"
								/>
								<div className="card-details p-4 px-0 flex flex-col gap-2 lg:px-6">
									<span className="title text-xl font-serif">
										Fr. George Maximov church visit
									</span>
									<span className="timestamp text-base uppercase">
										23 September 2025, 11:00 AM
									</span>
									<p className="text-base line-clamp-6">
										Lorem ipsum dolor sit amet consectetur,
										adipisicing elit. Dolorem ipsum, maxime
										minima blanditiis eum rem est minus fuga
										praesentium explicabo exercitationem
										excepturi esse harum nam perferendis
										pariatur, nesciunt assumenda dolore.
										Lorem ipsum dolor sit amet consectetur
										adipisicing elit. Qui expedita
										perspiciatis nihil minima dolorum
										sapiente in iure facere ipsa ex
										doloremque fugiat atque incidunt
										possimus assumenda quo, fugit asperiores
										maiores!
									</p>
								</div>
							</div>
						</div>
						<div className="schedule flex flex-col gap-4 flex-1">
							<span className="uppercase">Schedule</span>
							<div className="schedule-list flex flex-col w-full gap-4 pr-6 max-h-[20em] lg:max-h-[15em] overflow-y-auto">
								<div className="latest-scheduled flex items-center">
									<div className="flex flex-col gap-2 items-center text-center p-4 bg-gray-900 text-white font-serif">
										<span className="text-4xl">19</span>
										<span className="uppercase">
											Dec 25
										</span>
									</div>
									<div className="flex flex-col py-3 px-6 gap-1">
										<span className="text-xl">
											Divine Liturgy
										</span>
										<span>
											Nativity of the Theotokos Parish
										</span>
										<span className="text-sm">
											12:00 PM
										</span>
									</div>
								</div>
								<hr className="my-2" />
								<div className="scheduled-item flex items-center">
									<div className="flex flex-col gap-1 items-center text-center p-4 bg-gray-900 text-white font-serif">
										<span className="text-xl">25</span>
										<span className="text-xs uppercase">
											Dec 25
										</span>
									</div>
									<div className="flex flex-col py-2 px-4">
										<span className="text-base">
											Divine Liturgy
										</span>
										<span className="text-sm">
											Nativity of the Theotokos Parish
										</span>
										<span className="text-xs">
											12:00 PM
										</span>
									</div>
								</div>
								<div className="scheduled-item flex items-center">
									<div className="flex flex-col gap-1 items-center text-center p-4 bg-gray-900 text-white font-serif">
										<span className="text-xl">31</span>
										<span className="text-xs uppercase">
											Dec 25
										</span>
									</div>
									<div className="flex flex-col py-2 px-4">
										<span className="text-base">
											Divine Liturgy
										</span>
										<span className="text-sm">
											Nativity of the Theotokos Parish
										</span>
										<span className="text-xs">
											12:00 PM
										</span>
									</div>
								</div>
								<div className="scheduled-item flex items-center">
									<div className="flex flex-col gap-1 items-center text-center p-4 bg-gray-900 text-white font-serif">
										<span className="text-xl">07</span>
										<span className="text-xs uppercase">
											Jan 26
										</span>
									</div>
									<div className="flex flex-col py-2 px-4">
										<span className="text-base">
											Nativity Feast | Divine Liturgy
										</span>
										<span className="text-sm">
											Nativity of the Theotokos Parish
										</span>
										<span className="text-xs">
											12:00 PM
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="other-stories flex flex-col gap-4">
						<span className="uppercase">Other Stories</span>
						<div className="grid md:grid-cols-2 gap-6 lg:w-9/10">
							<div className="normal-card flex flex-col lg:flex-row lg:items-center lg:bg-transparent lg:text-black hover:cursor-pointer">
								<Image
									className="w-full h-[10em] lg:max-h-[8em] lg:min-h-full lg:h-full lg:w-[10em] object-cover"
									height={500}
									width={500}
									alt="Saint of the day"
									src="/nativity-2.jpg"
								/>
								<div className="card-details p-4 px-0 lg:px-6 flex flex-col gap-2">
									<span className="title text-lg font-serif">
										Fr Savva conducts liturgy
									</span>
									<span className="timestamp text-sm uppercase">
										04 October 2025, 12:00 AM
									</span>
									<p className="line-clamp-2 max-lg:hidden">
										Lorem ipsum dolor sit amet consectetur,
										adipisicing elit. Dolorem ipsum, maxime
										minima blanditiis eum rem est minus fuga
										praesentium explicabo exercitationem
										excepturi esse harum nam perferendis
										pariatur, nesciunt assumenda dolore.
										Lorem ipsum dolor sit amet consectetur
										adipisicing elit. Qui expedita
										perspiciatis nihil minima dolorum
										sapiente in iure facere ipsa ex
										doloremque fugiat atque incidunt
										possimus assumenda quo, fugit asperiores
										maiores!
									</p>
								</div>
							</div>
							<div className="normal-card flex flex-col lg:flex-row lg:items-center lg:bg-transparent lg:text-black hover:cursor-pointer">
								<Image
									className="w-full h-[10em] lg:max-h-[8em] lg:min-h-full lg:h-full lg:w-[10em] object-cover"
									height={500}
									width={500}
									alt="Saint of the day"
									src="/nativity-3.jpg"
								/>
								<div className="card-details p-4 px-0 lg:px-6 flex flex-col gap-2">
									<span className="title text-lg font-serif">
										Fr Savva conducts liturgy
									</span>
									<span className="timestamp text-sm uppercase">
										04 October 2025, 12:00 AM
									</span>
									<p className="line-clamp-2 max-lg:hidden">
										Lorem ipsum dolor sit amet consectetur,
										adipisicing elit. Dolorem ipsum, maxime
										minima blanditiis eum rem est minus fuga
										praesentium explicabo exercitationem
										excepturi esse harum nam perferendis
										pariatur, nesciunt assumenda dolore.
										Lorem ipsum dolor sit amet consectetur
										adipisicing elit. Qui expedita
										perspiciatis nihil minima dolorum
										sapiente in iure facere ipsa ex
										doloremque fugiat atque incidunt
										possimus assumenda quo, fugit asperiores
										maiores!
									</p>
								</div>
							</div>
							<div className="normal-card flex flex-col lg:flex-row lg:items-center lg:bg-transparent lg:text-black hover:cursor-pointer">
								<Image
									className="w-full h-[10em] lg:max-h-[8em] lg:min-h-full lg:h-full lg:w-[10em] object-cover"
									height={500}
									width={500}
									alt="Saint of the day"
									src="/nativity-5.jpg"
								/>
								<div className="card-details p-4 px-0 lg:px-6 flex flex-col gap-2">
									<span className="title text-lg font-serif">
										Fr Savva conducts liturgy
									</span>
									<span className="timestamp text-sm uppercase">
										04 October 2025, 12:00 AM
									</span>
									<p className="line-clamp-2 max-lg:hidden">
										Lorem ipsum dolor sit amet consectetur,
										adipisicing elit. Dolorem ipsum, maxime
										minima blanditiis eum rem est minus fuga
										praesentium explicabo exercitationem
										excepturi esse harum nam perferendis
										pariatur, nesciunt assumenda dolore.
										Lorem ipsum dolor sit amet consectetur
										adipisicing elit. Qui expedita
										perspiciatis nihil minima dolorum
										sapiente in iure facere ipsa ex
										doloremque fugiat atque incidunt
										possimus assumenda quo, fugit asperiores
										maiores!
									</p>
								</div>
							</div>
							<div className="normal-card flex flex-col lg:flex-row lg:items-center lg:bg-transparent lg:text-black hover:cursor-pointer">
								<Image
									className="w-full h-[10em] lg:max-h-[8em] lg:min-h-full lg:h-full lg:w-[10em] object-cover"
									height={500}
									width={500}
									alt="Saint of the day"
									src="/nativity-2.jpg"
								/>
								<div className="card-details p-4 px-0 lg:px-6 flex flex-col gap-2">
									<span className="title text-lg font-serif">
										Fr Savva conducts liturgy
									</span>
									<span className="timestamp text-sm uppercase">
										04 October 2025, 12:00 AM
									</span>
									<p className="line-clamp-2 max-lg:hidden">
										Lorem ipsum dolor sit amet consectetur,
										adipisicing elit. Dolorem ipsum, maxime
										minima blanditiis eum rem est minus fuga
										praesentium explicabo exercitationem
										excepturi esse harum nam perferendis
										pariatur, nesciunt assumenda dolore.
										Lorem ipsum dolor sit amet consectetur
										adipisicing elit. Qui expedita
										perspiciatis nihil minima dolorum
										sapiente in iure facere ipsa ex
										doloremque fugiat atque incidunt
										possimus assumenda quo, fugit asperiores
										maiores!
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="resources bg-[#250203] text-white">
				<div className="resources-content flex flex-col gap-8 p-9 py-14 lg:px-20">
					<div className="flex flex-col gap-6 w-full justify-center items-center md:flex-row">
						<div className="flex size-[20em] bg-[linear-gradient(to_bottom,transparent,black),url(/nativity-9.jpg)] bg-cover bg-center">
							<div className="flex size-full p-6 justify-center items-end text-center  text-white">
								<span className="text-3xl mb-3 font-serif">
									About our Parish
								</span>
							</div>
						</div>
						<div className="flex size-[20em] bg-[linear-gradient(to_bottom,transparent,black),url(/nativity-11.jpg)] bg-cover">
							<div className="flex size-full p-6 justify-center items-end text-center  text-white">
								<span className="text-3xl mb-3 font-serif">
									Liturgical Resources
								</span>
							</div>
						</div>
						<div className="flex size-[20em] bg-[linear-gradient(to_bottom,transparent,black),url(/nativity-7.jpg)] bg-cover bg-center">
							<div className="flex size-full p-6 justify-center items-end text-center  text-white">
								<span className="text-3xl mb-3 font-serif">
									What is Orthodoxy?
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="gallery bg-[antiquewhite] text-black">
				<div className="gallery-content flex flex-col gap-8 p-9 py-14 lg:px-20">
					<span className="text-3xl font-serif md:w-1/2">
						Gallery
						<hr className="mt-4 mb-0" />
					</span>
					<div className="swiper-container w-full max-w-full">
						<Swiper
							modules={[Navigation, Autoplay]}
							spaceBetween={30}
							breakpoints={{ 768: { slidesPerView: 3 } }}
							slidesPerView={"auto"}
							navigation
							autoplay
						>
							<SwiperSlide>
								<div className="h-[20em] w-[30em]">
									<Image
										className="object-cover object-center"
										src="/nativity.jpg"
										alt="gallery item"
										fill
									/>
								</div>
							</SwiperSlide>
							<SwiperSlide>
								<div className="h-[20em] w-[30em]">
									<Image
										className="object-cover object-center"
										src="/nativity-5.jpg"
										alt="gallery item"
										fill
									/>
								</div>
							</SwiperSlide>
							<SwiperSlide>
								<div className="h-[20em] w-[30em]">
									<Image
										className="object-cover object-center"
										src="/nativity-2.jpg"
										alt="gallery item"
										fill
									/>
								</div>
							</SwiperSlide>
							<SwiperSlide>
								<div className="h-[20em] w-[30em]">
									<Image
										className="object-cover object-center"
										src="/nativity-3.jpg"
										alt="gallery item"
										fill
									/>
								</div>
							</SwiperSlide>
							<SwiperSlide>
								<div className="h-[20em] w-[30em]">
									<Image
										className="object-cover object-center"
										src="/nativity-4.jpg"
										alt="gallery item"
										fill
									/>
								</div>
							</SwiperSlide>
						</Swiper>
					</div>
				</div>
			</section>
			<section className="mailing-list bg-gray-900 text-white">
				<div className="mailing-list-content flex flex-col gap-8 p-9 py-14 md:w-3/4 lg:px-20">
					<span className="text-3xl font-serif md:w-1/2">
						Join our Mailing List
						<hr className="mt-4 mb-0" />
					</span>
					{mailingListStatus != "subscribed" ? (
						<>
							<p>
								{
									"Stay up to date with the latest church news, announcements, and events straight from your mailbox. Enter your email below and subscribe if you haven't already."
								}
							</p>
							<form
								action={formData => {
									subscribe(
										formData
											.get("mailing-email")!
											.toString()
											.trim()
									);
								}}
								onSubmit={() => {
									setMailingListStatus("pending");
								}}
							>
								<div className="flex flex-nowrap text-black">
									<input
										className="grow p-4 bg-[whitesmoke]"
										type="email"
										placeholder="you@example.com"
										name="mailing-email"
										id="mailing-email"
										required
									/>
									<button
										className={`p-4 h-full w-[8em] bg-[#250203] text-white text-center disabled:bg-[#ac6c6e]`}
										type="submit"
										disabled={
											mailingListStatus == "pending"
										}
									>
										Subscribe
									</button>
								</div>
							</form>
						</>
					) : (
						<div>
							<p className="text-xl">
								Thank you for subscribing to our mailing list!
								We will be keeping you up to date with the
								latest news, updates, announcements and more.
							</p>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
