// TODO: Refactor this file
"use client";

import { useHome } from "@/src/lib/model-implementations/home";
import Home from "@/src/lib/components/views/home/Home";
import { WithContext, WebSite } from "schema-dts";
import { useLocale, useTranslations } from "next-intl";

export default function Page() {
	const home = useHome();
	const tMetadata = useTranslations("metadata");
	const locale = useLocale();

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: tMetadata("templateTitle"),
		alternateName: "NativityofTheotokos.com",
		url: window.location.origin + locale == "ru" ? "/ru" : "",
	} satisfies WithContext<WebSite>;

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Home model={home} />
		</>
	);
}
