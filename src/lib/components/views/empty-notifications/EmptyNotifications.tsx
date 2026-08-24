"use client";

import EmptyNotificationsGraphic from "@/public/assets/icon-5.svg";
import { useTranslations } from "next-intl";
import GoHomeButton from "../../button/GoHomeButton";
import InformationView from "../../information-view/InformationView";

export default function EmptyNotifications() {
	const t = useTranslations("emptyNotifications");
	const tMisc = useTranslations("miscellaneous");
	return (
		<InformationView
			model={{
				modelView: {
					mainMessage: t("mainMessage"),
					detailedMessage: t("detailedMessage"),
					Graphic: EmptyNotificationsGraphic,
					topBarColor: "#7F1D1D",
				},
			}}
		>
			<GoHomeButton>{tMisc("goHome")}</GoHomeButton>
		</InformationView>
	);
}
