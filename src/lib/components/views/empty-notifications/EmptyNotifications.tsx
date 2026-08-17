"use client";

import { georgia } from "@/src/lib/third-party/fonts";
import { useTranslations } from "next-intl";
import PageView from "../../page-view/PageView";
import EmptyNotificationsGraphic from "@/public/assets/icon-5.svg";

export default function EmptyNotifications() {
	const t = useTranslations("emptyNotifications");
	return (
		<PageView model={{ modelView: null }}>
			<div className="flex h-full min-h-[94svh] grow justify-center p-8 py-15 pb-20 text-center">
				<div className="flex h-[70svh] min-h-fit w-md flex-col items-center justify-center gap-6">
					<EmptyNotificationsGraphic className="h-64 w-80 fill-black opacity-90 md:h-48" />
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{t("mainMessage")}
					</span>
					<span className="text-lg">{t("detailedMessage")}</span>
				</div>
			</div>
		</PageView>
	);
}
