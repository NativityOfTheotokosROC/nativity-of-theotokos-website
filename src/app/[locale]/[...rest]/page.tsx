import { routing } from "@/src/i18n/routing";
import { Language } from "@/src/lib/type/general";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";

export async function generateMetadata(): Promise<Metadata> {
	"use cache";

	const { locale } = await rootLocale();

	const t = await getTranslations({
		locale: locale as Language,
		namespace: "notFound",
	});

	return { title: t("metaTitle") };
}

export default async function Page({
	params,
}: PageProps<"/[locale]/[...rest]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	setRequestLocale(language);
	notFound();
}
