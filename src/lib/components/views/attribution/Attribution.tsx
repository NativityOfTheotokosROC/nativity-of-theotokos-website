import { Link } from "@/src/lib/components/page-loading-bar/PageLoadingBar";
import PageView from "@/src/lib/components/page-view/PageView";
import {
	AttributionModel,
	License as LicenseType,
} from "@/src/lib/models/attribution";
import {
	ModeledVoidComponent,
	StyledModeledComponent,
} from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
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
				contentClassName: "md:px-20 lg:w-3/4",
			})}
		>
			<div className="flex flex-col gap-6 [&_a]:underline [&_a]:hover:text-[#dcb042] [&_a]:active:text-[#dcb042]">
				<ul className="flex list-inside list-disc flex-col gap-3">
					{licenses.map((license, index) => (
						<License
							key={index}
							model={newReadonlyModel({ license })}
						/>
					))}
				</ul>
			</div>
		</PageView>
	);
} satisfies ModeledVoidComponent<AttributionModel>;

const License = function ({ model, className, style }) {
	const {
		license: { website, text, subLicenseText, subLicenses },
	} = model.modelView;

	return (
		<li style={style} className={className}>
			<span>
				{`${text}${website ? ": " : ""}`}
				{website && (
					<Link
						href={website.link}
						target="_blank"
						rel="noopener"
						referrerPolicy="origin"
					>
						{website.linkLabel ?? website.link}
					</Link>
				)}
				{subLicenseText && `. ${subLicenseText}`}
			</span>
			{subLicenses && (
				<ul className={"flex list-inside list-[circle] flex-col pl-3"}>
					{subLicenses.map((subLicense, index) => (
						<License
							key={index}
							model={newReadonlyModel({ license: subLicense })}
						/>
					))}
				</ul>
			)}
		</li>
	);
} satisfies StyledModeledComponent<ReadonlyModel<{ license: LicenseType }>>;

export default Attribution;
