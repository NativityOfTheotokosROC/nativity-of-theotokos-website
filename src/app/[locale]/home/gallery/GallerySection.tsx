import { GallerySectionModel } from "@/src/lib/model/gallery-section";
import { ModeledVoidComponent } from "@mvc-react/components";
import { useTranslations } from "next-intl";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";

const GallerySection = function ({ model }) {
	const { modelView } = model;
	const tCaptions = useTranslations("imageCaptions");

	return (
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
								...modelView.galleryImages.map(
									(galleryImage, index) => (
										<SwiperSlide key={index}>
											<div className="flex justify-stretch items-stretch w-full h-full rounded-lg overflow-clip">
												<Image
													className="grow object-cover object-center"
													src={
														galleryImage.image
															.source
													}
													alt={
														galleryImage.image
															.about ??
														tCaptions(
															"galleryImage",
														)
													}
													title={
														galleryImage.image.about
													}
													placeholder="blur"
													blurDataURL={
														galleryImage.image
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
	);
} satisfies ModeledVoidComponent<GallerySectionModel>;

export default GallerySection;
