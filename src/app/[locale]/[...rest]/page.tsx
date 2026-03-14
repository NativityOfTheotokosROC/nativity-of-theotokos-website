import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/src/i18n/routing";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({locale}));
}

export default async function CatchAll({ params }: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		throw new Error("Invalid locale");
	}
	setRequestLocale(locale);
  notFound();
}
