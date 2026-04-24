import { routing } from "@/src/i18n/routing";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import PrivacyPolicy from "./PrivacyPolicy";
import { newReadonlyModel } from "@mvc-react/mvc";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]">): Promise<Metadata> {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "privacyPolicy",
	});
	return { title: t("title") };
}

export default async function Page({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";

	return <PrivacyPolicy model={newReadonlyModel({ language })} />;
}
