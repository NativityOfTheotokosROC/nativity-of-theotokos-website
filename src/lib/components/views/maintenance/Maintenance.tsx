"use client";

import MaintenanceGraphic from "@/public/assets/ornament_36.svg";
import { Language } from "@/src/lib/types/general";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import PageNavigationButton from "../../button/PageNavigationButton";
import InformationView from "../../information-view/InformationView";

const Maintenance = function ({}) {
	const t = useTranslations("maintenance");

	return (
		<InformationView
			model={newReadonlyModel({
				mainMessage: t("title"),
				detailedMessage: t("description"),
				Graphic: MaintenanceGraphic,
			})}
		>
			<PageNavigationButton
				model={newReadonlyModel({
					endpoint: "/",
				})}
			>
				{t("goHome")}
			</PageNavigationButton>
		</InformationView>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default Maintenance;
