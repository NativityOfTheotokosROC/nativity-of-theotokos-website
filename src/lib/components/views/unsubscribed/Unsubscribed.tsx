"use client";

import UnsubscribeGraphic from "@/public/assets/graphic-4.svg";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import GoHomeButton from "../../button/GoHomeButton";
import InformationView from "../../information-view/InformationView";
import { ModeledVoidComponent } from "@mvc-react/components";

const Unsubscribed = function ({ model }) {
	const { email } = model.modelView;
	const t = useTranslations();

	return (
		<InformationView
			model={newReadonlyModel({
				Graphic: UnsubscribeGraphic,
				mainMessage: t("unsubscribe.title"),
			})}
		>
			<span>
				{t.rich("unsubscribe.message", {
					emailText: email,
					email: text => (
						<span className="font-semibold">{text}</span>
					),
				})}
			</span>
			<GoHomeButton>{t("miscellaneous.goHome")}</GoHomeButton>
		</InformationView>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ email: string }>>;

export default Unsubscribed;
