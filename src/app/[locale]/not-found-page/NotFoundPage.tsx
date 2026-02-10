"use client";
import NotFoundGraphic from "@/public/ui/ornament_35.svg";
import { georgia } from "@/src/lib/third-party/fonts";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useContext, useLayoutEffect } from "react";
import {
	LoadingBarContext,
	useLoadingBarRouter,
} from "@/src/lib/component/loading-bar/LoadingBar";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "notFound" });

	return {
		title: t("metaTitle"),
	};
}

export default function NotFoundPage() {
	const router = useLoadingBarRouter(useRouter);
	const locale = useLocale();
	const loadingBar = useContext(LoadingBarContext);
	const t = useTranslations("notFound");

	useLayoutEffect(() => {
		window.history.scrollRestoration = "manual";
		window.scrollTo(0, 0);
	}, []);

	return (
		<main className={`not-found bg-[#FEF8F3] text-black`}>
			<div className="not-found-content flex items-center justify-center text-center p-8 py-15 pb-20 h-full min-h-max border-t-15 border-[#976029]/90">
				<div className="flex flex-col items-center justify-center gap-6 w-md">
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
							if (loadingBar.modelView)
								router.push("/", { locale });
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
