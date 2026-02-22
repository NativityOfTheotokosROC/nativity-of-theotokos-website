import { LatestNewsOrnament } from "@/src/lib/component/miscellaneous/graphic";
import NewsArticlePreview from "@/src/lib/component/news-article-preview/NewsArticlePreview";
import SchedulePreviewWidget from "@/src/lib/component/schedule-preview-widget/SchedulePreviewWidget";
import { BulletinSectionModel } from "@/src/lib/model/bulletin-section";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const BulletinSection = function ({ model }) {
	const { modelView } = model;
	const t = useTranslations("home");

	return (
		<section id="bulletin" className="news pt-4 text-black">
			<div className="ornament flex justify-center items-center mb-4 md:mb-0 w-full ">
				<LatestNewsOrnament
					className="h-[6em] w-[25em] max-w-9/10"
					fill="#88815899"
				/>
			</div>
			{modelView && (
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
							<span className="text-xl">{t("featured")}</span>
							<NewsArticlePreview
								model={newReadonlyModel({
									isFeatured: true,
									articlePreview:
										modelView.newsArticles.featuredArticle,
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
							<span className="text-xl">{t("schedule")}</span>
							<SchedulePreviewWidget
								model={newReadonlyModel({
									scheduleItems: modelView.schedulePreview,
								})}
							/>
						</motion.div>
					</div>
					<div className="other-stories flex flex-col gap-4 pt-10 pb-15 px-8 lg:px-20 bg-white/70 border-t-2 border-t-[#dcb042]">
						<span className="text-xl mb-1">{t("moreNews")}</span>
						<div className="grid md:grid-cols-2 gap-8 md:gap-6 md:w-95/100 lg:w-85/100">
							{[...modelView.newsArticles.otherNewsArticles].map(
								(articlePreview, index) => (
									<NewsArticlePreview
										key={index}
										model={newReadonlyModel({
											isFeatured: false,
											articlePreview,
										})}
									/>
								),
							)}
						</div>
					</div>
				</div>
			)}
		</section>
	);
} satisfies ModeledVoidComponent<BulletinSectionModel>;

export default BulletinSection;
