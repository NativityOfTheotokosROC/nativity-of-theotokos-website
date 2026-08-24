"use client";

import NotFoundGraphic from "@/public/assets/ornament_35.svg";
import { georgia } from "@/src/lib/third-party/fonts";
import { Language } from "@/src/lib/types/general";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import GoHomeButton from "../../button/GoHomeButton";
import InformationView from "../../information-view/InformationView";

export const NotFound = function ({}) {
	// "use cache";

	// const { language } = model.modelView;
	const t = useTranslations("notFound");

	return (
		<InformationView
			model={newReadonlyModel({
				mainMessage: t("title"),
				detailedMessage: t("description"),
				Graphic: NotFoundGraphic,
				topBarColor: "#976029",
			})}
		>
			<GoHomeButton>{t("goHome")}</GoHomeButton>
		</InformationView>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default NotFound;
