import { routing } from "@/src/i18n/routing";
import { AttributionModelView } from "@/src/lib/models/attribution";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import Attribution from "./Attribution";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]">): Promise<Metadata> {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "licenses",
	});
	return { title: t("alternateTitle") };
}

export default async function Page({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "licenses_variable",
	});
	const tLinks = await getTranslations({
		locale: language,
		namespace: "links",
	});
	const licenses = [
		{
			text: t("dailyReadingsLicense"),
			link: tLinks("holyTrinityChurch"),
			linkLabel: "Holy Trinity Orthodox Church",
		},
		{
			text: t("logoIconLicense"),
			link: "https://lordicon.com",
			linkLabel: "Lordicon.com",
		},
	] satisfies AttributionModelView["licenses"];

	return <Attribution model={newReadonlyModel({ language, licenses })} />;
}
