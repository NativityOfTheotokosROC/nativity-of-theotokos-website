import MaintenanceGraphic from "@/public/assets/ornament_36.svg";
import { georgia } from "@/src/lib/third-party/fonts";
import { Language } from "@/src/lib/type/general";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import PageNavigationButton from "../../button/PageNavigationButton";

const Maintenance = async function ({ model }) {
	"use cache";

	const { language } = model.modelView;
	const t = await getTranslations({
		locale: language,
		namespace: "maintenance",
	});

	return (
		<main className={`maintenance bg-[#FEF8F3] text-black`}>
			<div className="maintenance-content flex h-full min-h-[94svh] grow justify-center border-t-15 border-[#9C3801]/90 p-8 py-15 pb-20 text-center">
				<div className="flex h-[70svh] min-h-fit w-md flex-col items-center justify-center gap-6">
					<MaintenanceGraphic
						className="h-54 w-64 md:h-48"
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
							endpoint: "/",
						})}
					>
						{t("goHome")}
					</PageNavigationButton>
				</div>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default Maintenance;
