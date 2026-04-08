import MaintenanceGraphic from "@/public/assets/ornament_36.svg";
import { georgia } from "@/src/lib/third-party/fonts";
import { Language } from "@/src/lib/type/general";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import PageNavigationButton from "../../page-navigation-button/PageNavigationButton";

const Maintenance = async function ({ model }) {
	"use cache";

	const { language } = model.modelView;
	const t = await getTranslations({
		locale: language,
		namespace: "maintenance",
	});

	return (
		<main className={`maintenance bg-[#FEF8F3] text-black`}>
			<div className="maintenance-content flex justify-center text-center p-8 py-15 pb-20 grow min-h-[94svh] h-full border-t-15 border-[#9C3801]/90">
				<div className="flex flex-col min-h-fit h-[70svh] items-center justify-center gap-6 w-md">
					<MaintenanceGraphic
						className="h-54 md:h-48 w-64"
						opacity={0.9}
						fill="#000"
					/>
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{t("title")}
					</span>
					<span className="text-lg">{t("description")}</span>
					<PageNavigationButton
						model={newReadonlyModel({
							buttonContent: t("goHome"),
							endpoint: "/",
						})}
					/>
				</div>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default Maintenance;
