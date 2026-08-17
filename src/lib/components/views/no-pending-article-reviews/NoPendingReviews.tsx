"use client";

import { georgia } from "@/src/lib/third-party/fonts";
import { useTranslations } from "next-intl";
import PageView from "../../page-view/PageView";
import NoPendingArticleReviewsGraphic from "@/public/assets/icon-6.svg";
import GoHomeButton from "../../button/GoHomeButton";

export default function NoPendingArticleReviews() {
	const t = useTranslations("emptyReviewArticle");
	const tMisc = useTranslations("miscellaneous");
	return (
		<PageView model={{ modelView: null }}>
			<div className="flex h-full grow justify-center text-center">
				<div className="flex w-md flex-col items-center justify-center gap-6 landscape:h-[70svh]">
					<NoPendingArticleReviewsGraphic className="h-64 w-80 fill-black opacity-90 md:h-48" />
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{t("mainMessage")}
					</span>
					<span className="text-lg">{t("detailedMessage")}</span>
					<GoHomeButton>{tMisc("goHome")}</GoHomeButton>
				</div>
			</div>
		</PageView>
	);
}
