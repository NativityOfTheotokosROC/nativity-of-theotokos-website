"use client";

import ForbiddenGraphic from "@/public/ui/icon-3.svg";
import { useRouter } from "@/src/i18n/navigation";
import { useLoadingBarRouter } from "@/src/lib/component/loading-bar/navigation";
import { georgia } from "@/src/lib/third-party/fonts";
import { useTranslations } from "next-intl";
import { useLayoutEffect } from "react";

export default function Forbidden() {
	const router = useLoadingBarRouter(useRouter);
	const t = useTranslations("unauthorized");

	useLayoutEffect(() => {
		window.history.scrollRestoration = "manual";
		window.scrollTo(0, 0);
	}, []);

	return (
		<main className={`forbidden bg-[#FEF8F3] text-black`}>
			<div className="forbidden-content flex items-center justify-center text-center p-8 py-15 pb-20 grow min-h-max h-full border-t-15 border-[#832C0B]/90">
				<div className="flex flex-col items-center justify-center gap-6 w-md">
					<ForbiddenGraphic
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
							router.push("/");
						}}
					>
						{t("goHome")}
					</button>
				</div>
			</div>
		</main>
	);
}
