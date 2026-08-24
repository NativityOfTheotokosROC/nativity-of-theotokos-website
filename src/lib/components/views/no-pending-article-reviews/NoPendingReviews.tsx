"use client";

import NoPendingArticleReviewsGraphic from "@/public/assets/icon-6.svg";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import GoHomeButton from "../../button/GoHomeButton";
import InformationView from "../../information-view/InformationView";

export default function NoPendingArticleReviews() {
	const t = useTranslations("emptyReviewArticle");
	const tMisc = useTranslations("miscellaneous");
	return (
		<InformationView
			model={newReadonlyModel({
				mainMessage: t("mainMessage"),
				detailedMessage: t("detailedMessage"),
				Graphic: NoPendingArticleReviewsGraphic,
			})}
		>
			<GoHomeButton>{tMisc("goHome")}</GoHomeButton>
		</InformationView>
	);
}
