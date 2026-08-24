import { Link } from "@/src/lib/components/page-loading-bar/PageLoadingBar";
import PageView from "@/src/lib/components/page-view/PageView";
import { AttributionModel } from "@/src/lib/models/attribution";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";

const Attribution = async function ({ model }) {
	const { language, licenses } = model.modelView;
	const t = await getTranslations({
		locale: language,
		namespace: "attribution",
	});

	return (
		<PageView
			model={newReadonlyModel({
				title: t("title"),
				topBarColor: "#9F2D00",
			})}
		>
			<div className="flex flex-col gap-6 [&_a]:underline [&_a]:hover:text-[#dcb042] [&_a]:active:text-[#dcb042]">
				<ul className="flex list-inside list-disc flex-col gap-3">
					{licenses.map((license, index) => (
						<li key={index}>
							<span>
								{`${license.text}: `}
								<Link href={license.link} target="_blank">
									{license.linkLabel}
								</Link>
							</span>
						</li>
					))}
				</ul>
			</div>
		</PageView>
	);
} satisfies ModeledVoidComponent<AttributionModel>;

export default Attribution;
