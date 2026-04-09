import NotFoundGraphic from "@/public/assets/ornament_35.svg";
import { georgia } from "@/src/lib/third-party/fonts";
import { getTranslations } from "next-intl/server";
import GoHomeButton from "./GoHomeButton";

export default async function NotFound() {
	const t = await getTranslations("notFound");

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
}
