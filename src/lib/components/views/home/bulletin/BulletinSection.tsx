import LatestNewsOrnament from "@/public/assets/ornament_11.svg";
import ArticlePreview from "@/src/lib/components/article-preview/ArticlePreview";
import SchedulePreviewWidget from "@/src/lib/components/schedule-preview-widget/SchedulePreviewWidget";
import { BulletinSectionModel } from "@/src/lib/models/bulletin-section";
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
			<div className="ornament mb-4 flex w-full items-center justify-center md:mb-0">
				<LatestNewsOrnament
					className="h-[6em] w-[25em] max-w-9/10"
					fill="#88815899"
				/>
			</div>
			{modelView && (
				<div className="news-content flex flex-col gap-8">
					<span
						className={`mb-2 w-full px-8 text-[2.75rem]/tight font-semibold md:w-1/2 md:text-black lg:px-20 ${georgia.className}`}
					>
						{t("latestNewsHeader")}
						<hr className="mt-4 mb-0 md:w-full" />
					</span>
					<div className="flex flex-col gap-x-12 gap-y-6 px-8 pb-6 md:flex-row lg:justify-between lg:px-20">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.1 }}
							transition={{
								ease: "easeOut",
							}}
							className="featured flex flex-col gap-4 md:max-w-1/2 lg:max-w-[45%] [&_.featured-card]:max-w-full"
						>
							<span className="text-xl">{t("featured")}</span>
							<ArticlePreview
								model={newReadonlyModel({
									isDetailed: true,
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
							className="schedule flex flex-1 flex-col gap-4 lg:max-w-5/10"
						>
							<span className="text-xl">{t("schedule")}</span>
							<SchedulePreviewWidget
								model={newReadonlyModel({
									scheduleItems: modelView.schedulePreview,
								})}
							/>
						</motion.div>
					</div>
					<div className="other-stories flex flex-col gap-4 border-t-2 border-t-[#dcb042] bg-white/70 px-8 pt-10 pb-15 lg:px-20">
						<span className="mb-1 text-xl">{t("moreNews")}</span>
						<div className="grid gap-8 md:w-95/100 md:grid-cols-2 md:gap-6 lg:w-85/100">
							{[...modelView.newsArticles.otherNewsArticles].map(
								(articlePreview, index) => (
									<ArticlePreview
										key={index}
										model={newReadonlyModel({
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
