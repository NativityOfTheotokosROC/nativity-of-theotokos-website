import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function CatchAll({
	params,
}: PageProps<"/[locale]/[...rest]">) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		throw new Error("Invalid locale");
	}
	setRequestLocale(locale);
	return notFound();
}
