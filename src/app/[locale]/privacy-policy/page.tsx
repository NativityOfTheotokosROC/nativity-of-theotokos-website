import { routing } from "@/src/i18n/routing";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import PrivacyPolicy from "./PrivacyPolicy";
import { newReadonlyModel } from "@mvc-react/mvc";
import { isValidLocale } from "@/src/lib/utilities/internationalization";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/privacy-policy">): Promise<Metadata> {
	const { locale } = await params;
	const language = isValidLocale(locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "privacyPolicy",
	});
	return { title: t("title") };
}

export default async function Page({
	params,
}: PageProps<"/[locale]/privacy-policy">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";

	return <PrivacyPolicy model={newReadonlyModel({ language })} />;
}
