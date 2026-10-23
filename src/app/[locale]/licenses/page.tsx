import { routing } from "@/src/i18n/routing";
import { AttributionModelView } from "@/src/lib/models/attribution";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import Attribution from "../../../lib/components/views/attribution/Attribution";
import { isValidLocale } from "@/src/lib/utilities/internationalization";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]">): Promise<Metadata> {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "attribution",
	});
	return { title: t("title") };
}

export default async function Page({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	const language = isValidLocale(locale) ? locale : "en";
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
			website: {
				link: tLinks("holyTrinityChurch"),
				linkLabel: "Holy Trinity Orthodox Church",
			},
		},
		{
			text: t("orthoGraphicsLicense"),
			subLicenseText: t("orthoGraphicsSubLicense"),
			website: {
				link: "https://orthodoxartsjournal.org/orthodox-illustration-project/",
				linkLabel: "The Orthodox Illustration Project",
			},
			subLicenses: [
				{
					text: "Scott Patrick O’Rourke",
				},
				{
					text: "Christabel Anderson",
					website: {
						link: "https://www.christabelanderson.com/",
					},
				},
				{
					text: "Andrew Gould",
					website: {
						link: "https://www.newworldbyzantine.com",
					},
				},
				{
					text: "Alvin Alexsi Currier",
					website: {
						link: "https://alvinalexsicurrier.com/",
					},
				},
				{
					text: "Fr. Silouan Justiniano",
				},
				{
					text: "Lauren Pope",
					website: {
						link: "https://www.flickr.com/photos/lavatican/",
					},
				},
				{
					text: "Bess Crider",
				},
				{
					text: "Vojislav Lukovich",
					website: {
						link: "https://www.srpske-pravoslavne-ikone.com/",
					},
				},
			],
		},
		{
			text: t("logoIconLicense"),
			website: {
				link: "https://lordicon.com",
				linkLabel: "Lordicon.com",
			},
		},
	] satisfies AttributionModelView["licenses"];

	return <Attribution model={newReadonlyModel({ language, licenses })} />;
}
