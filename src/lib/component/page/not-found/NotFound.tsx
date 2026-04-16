"use client";

import NotFoundGraphic from "@/public/assets/ornament_35.svg";
import { georgia } from "@/src/lib/third-party/fonts";
import { Language } from "@/src/lib/type/general";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import GoHomeButton from "./GoHomeButton";

export const NotFound = function ({}) {
	// "use cache";

	// const { language } = model.modelView;
	const t = useTranslations("notFound");

	return (
		<main className={`not-found flex flex-col bg-[#FEF8F3] text-black`}>
			<div className="not-found-content flex h-full min-h-[94svh] grow justify-center border-t-15 border-[#976029]/90 p-8 py-15 pb-20 text-center">
				<div className="flex h-[70svh] min-h-fit w-md flex-col items-center justify-center gap-6">
					<NotFoundGraphic className="h-64 w-80 fill-black opacity-90 md:h-48" />
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{t("title")}
					</span>
					<span className="text-lg">{t("description")}</span>
					<GoHomeButton>{t("goHome")}</GoHomeButton>
				</div>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default NotFound;
