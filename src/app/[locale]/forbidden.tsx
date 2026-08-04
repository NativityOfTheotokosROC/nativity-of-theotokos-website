import { routing } from "@/src/i18n/routing";
import Forbidden from "@/src/lib/components/views/forbidden/Forbidden";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as localeParam } from "next/root-params";
import { hasLocale } from "next-intl";

export function generateStaticParams() {
	return [...routing.locales.map(locale => ({ locale }))];
}

export async function generateMetadata(): Promise<Metadata> {
	const locale = await localeParam();
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const t = await getTranslations({
		namespace: "unauthorized",
		locale: language,
	});

	return {
		title: t("metaTitle"),
	};
}

export default async function Page() {
	return (
		<Forbidden
			model={newReadonlyModel({
				signOutEndpoint: "/",
			})}
		/>
	);
}
