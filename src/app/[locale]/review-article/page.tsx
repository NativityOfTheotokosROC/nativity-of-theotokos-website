import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	const language = isValidLocale(locale) ? locale : "en";
	const t = await getTranslations({
		namespace: "reviewArticle",
		locale: language,
	});
	return {
		title: t("title"),
	} satisfies Metadata;
}

export default async function Page({ params }: PageProps<"/[locale]">) {
	return <></>;
}
