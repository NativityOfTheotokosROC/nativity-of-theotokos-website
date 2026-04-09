import ForbiddenGraphic from "@/public/assets/icon-3.svg";
import { ForbiddenModel } from "@/src/lib/model/forbidden";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import PageNavigationButton from "../../button/PageNavigationButton";
import SignOutButton from "../../button/SignOutButton";
import { rootLocale } from "next/root-params";

const Forbidden = async function ({ model }) {
	"use cache";

	const locale = await rootLocale();
	const { signOutEndpoint } = model.modelView;
	const t = await getTranslations({ locale, namespace: "unauthorized" });

	return (
		<main className={`forbidden bg-[#FEF8F3] text-black`}>
			<div className="forbidden-content flex h-full min-h-[94svh] grow justify-center border-t-15 border-[#832C0B]/90 p-8 py-15 pb-20 text-center">
				<div className="flex h-[70svh] min-h-fit w-md flex-col items-center justify-center gap-6">
					<ForbiddenGraphic className="h-72 w-80 fill-black opacity-90 md:h-60" />
					<span
						className={`text-4xl font-semibold ${georgia.className}`}
					>
						{t("title")}
					</span>
					<span className="text-lg">{t("description")}</span>
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
				</div>
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<InitializedModel<ForbiddenModel>>;

export default Forbidden;
