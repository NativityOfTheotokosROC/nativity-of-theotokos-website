"use client";

import { useRouter } from "@/src/i18n/navigation";
import NotFoundGraphic from "@/public/assets/ornament_35.svg";
import { usePageLoadingBarRouter } from "@/src/lib/utility/page-loading-bar";
import { PageLoadingBarContext } from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import { georgia } from "@/src/lib/third-party/fonts";
import { useTranslations } from "next-intl";
import { useContext } from "react";

export default function NotFound() {
	const router = usePageLoadingBarRouter(useRouter);
	const pageLoadingBar = useContext(PageLoadingBarContext);
	const t = useTranslations("notFound");

	return (
		<main className={`not-found flex flex-col bg-[#FEF8F3] text-black`}>
			<div className="grow not-found-content flex justify-center text-center p-8 py-15 pb-20 h-full min-h-[94svh] border-t-15 border-[#976029]/90">
				<div className="flex flex-col min-h-fit h-[70svh] items-center justify-center gap-6 w-md">
					<NotFoundGraphic
						className="h-64 md:h-48 w-80"
						opacity={0.9}
						fill="#000"
					/>
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{t("title")}
					</span>
					<span className="text-lg">{t("description")}</span>
					<button
						className="text-white rounded-lg bg-[#250203]/82 p-4 w-30 hover:bg-[#250203]/92 active:bg-[#250203]"
						onClick={() => {
							if (pageLoadingBar.modelView) router.push("/");
							else window.open("/", "_self");
						}}
					>
						{t("goHome")}
					</button>
				</div>
			</div>
		</main>
	);
}
