import { Link } from "@/src/lib/components/page-loading-bar/PageLoadingBar";
import { AttributionModel } from "@/src/lib/models/attribution";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { getTranslations } from "next-intl/server";

const Attribution = async function ({ model }) {
	const { language, licenses } = model.modelView;
	const t = await getTranslations({
		locale: language,
		namespace: "licenses",
	});

	return (
		<main className="attribution border-t-15 border-t-orange-800 bg-[#FEF8F3] text-black">
			<div className="attribution-content flex min-h-[94svh] flex-col gap-6 p-8 py-9 md:px-20 md:py-10 lg:w-3/4">
				<span
					className={`mb-2 text-[2.75rem]/tight font-semibold wrap-break-word hyphens-auto md:w-3/4 ${georgia.className}`}
				>
					{t("alternateTitle")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<div className="flex flex-col gap-6 [&_a]:underline [&_a]:hover:text-[#ffdc4f] [&_a]:active:text-[#ffdc4f]">
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
			</div>
		</main>
	);
} satisfies ModeledVoidComponent<AttributionModel>;

export default Attribution;
