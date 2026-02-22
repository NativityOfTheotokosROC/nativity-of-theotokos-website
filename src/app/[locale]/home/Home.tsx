"use client";

import HymnsModal from "@/src/lib/component/hymns-modal/HymnsModal";
import SplashScreen from "@/src/lib/component/splash-screen/SplashScreen";
import { hymnsModalVIInterface } from "@/src/lib/model-implementation/hymns-modal";
import { useMailingListRepository } from "@/src/lib/model-implementation/mailing-list-repository";
import { HomeModel } from "@/src/lib/model/home";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useState } from "react";
import BulletinSection from "./bulletin/BulletinSection";
import DailyQuoteSection from "./daily-quote/DailyQuoteSection";
import DailyReadingsSection from "./daily-readings/DailyReadingsSection";
import GallerySection from "./gallery/GallerySection";
import HeroSection from "./hero/HeroSection";
import "./home.css";
import MailingListSection from "./mailing-list/MailingListSection";
import ResourcesSection from "./resources/ResourcesSection";

const Home = function ({ model }) {
	const { modelView } = model;
	const hymnsModal = useInitializedStatefulInteractiveModel(
		hymnsModalVIInterface(),
		{ isOpen: false, hymns: [] },
	);
	const mailingListRepository = useMailingListRepository();
	const [splashExited, setSplashExited] = useState(false);
	const t = useTranslations("home");
	const tLinks = useTranslations("links");

	useLayoutEffect(() => {
		if (!modelView) {
			window.history.scrollRestoration = "manual";
			window.scrollTo(0, 0);
		}
	}, [modelView]);

	return (
		<>
			<SplashScreen
				model={newReadonlyModel({
					isShown: !modelView,
					exitedCallback: () => setSplashExited(true),
				})}
			/>
			{hymnsModal.modelView && (
				<HymnsModal
					model={{
						modelView: hymnsModal.modelView,
						interact: hymnsModal.interact,
					}}
				/>
			)}
			<main
				className={`home bg-[linear-gradient(135deg,#F7DAC1,whitesmoke)]`}
			>
				<HeroSection
					model={newReadonlyModel({
						title: t("heroTitle"),
						subtitle: t("heroSubtitle"),
						introduce: splashExited,
					})}
				/>
				<DailyReadingsSection
					model={newReadonlyModel({
						dailyReadings: modelView?.dailyReadings ?? null,
						hymnsModal,
					})}
				/>
				<DailyQuoteSection
					model={newReadonlyModel({
						dailyQuote: modelView?.dailyQuote ?? null,
					})}
				/>
				<BulletinSection
					model={
						modelView
							? newReadonlyModel({
									newsArticles: modelView.newsArticles,
									schedulePreview: modelView.scheduleItems,
								})
							: { modelView: null }
					}
				/>
				<ResourcesSection
					model={newReadonlyModel({
						resources: [
							{
								label: t("liturgicalResources"),
								link: tLinks("liturgicalResources"),
								graphic: "/ui/liturgical-resources.jpg",
							},
							{
								label: t("whatIsOrthodoxy"),
								link: tLinks("whatIsOrthodoxy"),
								graphic: "/ui/what-is-orthodoxy.jpg",
							},
							{
								label: t("aboutOurParish"),
								link: "/about-us",
								graphic: "/ui/about-our-parish.jpg",
							},
						],
					})}
				/>
				<GallerySection
					model={
						modelView
							? newReadonlyModel({
									galleryImages: modelView.dailyGalleryImages,
								})
							: { modelView: null }
					}
				/>
				<MailingListSection
					model={newReadonlyModel({ mailingListRepository })}
				/>
			</main>
		</>
	);
} satisfies ModeledVoidComponent<HomeModel>;

export default Home;
