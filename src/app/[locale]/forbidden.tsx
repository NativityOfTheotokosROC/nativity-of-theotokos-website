import { routing } from "@/src/i18n/routing";
import Forbidden from "@/src/lib/component/page/forbidden/Forbidden";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";

export function generateStaticParams() {
	return [...routing.locales.map(locale => ({ locale }))];
}

export async function generateMetadata(): Promise<Metadata> {
	const locale = await rootLocale();
	const t = await getTranslations({ locale, namespace: "unauthorized" });

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
