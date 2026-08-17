"use client";

import { georgia } from "@/src/lib/third-party/fonts";
import { useTranslations } from "next-intl";
import PageView from "../../page-view/PageView";
import EmptyNotificationsGraphic from "@/public/assets/icon-5.svg";
import GoHomeButton from "../../button/GoHomeButton";

export default function EmptyNotifications() {
	const t = useTranslations("emptyNotifications");
	const tMisc = useTranslations("miscellaneous");
	return (
		<PageView model={{ modelView: { topBarColor: "#7F1D1D" } }}>
			<div className="flex h-full grow justify-center text-center">
				<div className="flex h-[70svh] w-md flex-col items-center justify-center gap-6">
					<EmptyNotificationsGraphic className="h-64 w-80 fill-black opacity-90 md:h-48" />
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
