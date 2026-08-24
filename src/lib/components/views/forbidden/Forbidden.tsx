"use client";

import ForbiddenGraphic from "@/public/assets/icon-3.svg";
import { ForbiddenModel } from "@/src/lib/models/forbidden";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import PageNavigationButton from "../../button/PageNavigationButton";
import SignOutButton from "../../button/SignOutButton";
import InformationView from "../../information-view/InformationView";

const Forbidden = function ({ model }) {
	const { signOutEndpoint } = model.modelView;
	const t = useTranslations("unauthorized");

	return (
		<InformationView
			model={newReadonlyModel({
				mainMessage: t("title"),
				detailedMessage: t("description"),
				Graphic: ForbiddenGraphic,
				topBarColor: "#832C0B",
			})}
		>
			<div className="flex gap-4">
				<PageNavigationButton
					model={newReadonlyModel({
						endpoint: "/",
					})}
				>
					{t("goHome")}
				</PageNavigationButton>
				<SignOutButton
					model={newReadonlyModel({
						signOutEndpoint,
					})}
				>
					{t("signOut")}
				</SignOutButton>
			</div>
		</InformationView>
	);
} satisfies ModeledVoidComponent<InitializedModel<ForbiddenModel>>;

export default Forbidden;
