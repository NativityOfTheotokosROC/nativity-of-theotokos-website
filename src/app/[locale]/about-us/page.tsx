import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Maintenance from "@/src/lib/component/page/maintenance/Maintenance";
import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";
import { newReadonlyModel } from "@mvc-react/mvc";

export async function generateStaticParams() {
	return [...routing.locales.map(locale => ({ locale }))];
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/about-us">): Promise<Metadata> {
	"use cache";

	const { locale } = await params;
	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "aboutUs",
	});

	return {
		title: t("metaTitle"),
	};
}

export const dynamic = "force-static";

export default async function Page({
	params,
}: PageProps<"/[locale]/about-us">) {
	"use cache";

	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	return <Maintenance model={newReadonlyModel({ language })} />;
}
