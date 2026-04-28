import { routing } from "@/src/i18n/routing";
import HomeClient from "@/src/lib/components/views/home/client";
import { BASE_URL } from "@/src/lib/utilities/server-constants";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { WebSite, WithContext } from "schema-dts";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]">): Promise<Metadata> {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const tMetadata = await getTranslations({
		locale: language,
		namespace: "metadata",
	});
	const description = tMetadata("description");

	return {
		alternates: {
			canonical: BASE_URL,
			languages: {
				en: BASE_URL,
				ru: BASE_URL + "/ru",
			},
		},
		openGraph: {
			url: BASE_URL,
			description,
			type: "website",
			images: ["/opengraph-image.jpg"],
			siteName: tMetadata("templateDefault"),
		},
		twitter: {
			card: "summary",
			description,
			images: ["/opengraph-image.jpg"],
		},
	};
}

export default async function Page({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const tMetadata = await getTranslations({
		locale: language,
		namespace: "metadata",
	});
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: tMetadata("templateTitle"),
		alternateName: "NativityofTheotokos.com",
		url: BASE_URL + locale == "ru" ? "/ru" : "",
	} satisfies WithContext<WebSite>;

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<HomeClient />
		</>
	);
}
