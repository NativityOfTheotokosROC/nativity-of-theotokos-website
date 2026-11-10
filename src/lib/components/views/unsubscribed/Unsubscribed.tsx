"use client";

import UnsubscribeGraphic from "@/public/assets/graphic-4.svg";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import GoHomeButton from "../../button/GoHomeButton";
import InformationView from "../../information-view/InformationView";

const Unsubscribed = function () {
	const t = useTranslations();

	return (
		<InformationView
			model={newReadonlyModel({
				Graphic: UnsubscribeGraphic,
				mainMessage: t("unsubscribe.title"),
				detailedMessage: t("unsubscribe.message"),
			})}
		>
			<GoHomeButton>{t("miscellaneous.goHome")}</GoHomeButton>
		</InformationView>
	);
};

export default Unsubscribed;
