"use client";
import { useRouter } from "@/src/i18n/navigation";
import { routing } from "@/src/i18n/routing";
import { NotFoundGraphic } from "@/src/lib/component/miscellaneous/graphic";
import { usePageLoadingBarRouter } from "@/src/lib/component/page-loading-bar/navigation";
import { PageLoadingBarContext } from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import { georgia } from "@/src/lib/third-party/fonts";
import { Metadata } from "next";
import { hasLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { useContext, useLayoutEffect } from "react";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;

	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "notFound",
	});

	return {
		title: t("metaTitle"),
	};
}

export default function NotFoundPage() {
	const router = usePageLoadingBarRouter(useRouter);
	const pageLoadingBar = useContext(PageLoadingBarContext);
	const t = useTranslations("notFound");

	useLayoutEffect(() => {
		window.history.scrollRestoration = "manual";
		window.scrollTo(0, 0);
	}, []);

	return (
		<main className={`not-found flex flex-col bg-[#FEF8F3] text-black`}>
			<div className="grow not-found-content flex items-center justify-center text-center p-8 py-15 pb-20 h-full min-h-max border-t-15 border-[#976029]/90">
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
