import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";
import { newReadonlyModel } from "@mvc-react/mvc";
import Forbidden from "@/src/lib/component/page/forbidden/Forbidden";

export async function generateStaticParams() {
	return [...routing.locales.map(locale => ({ locale }))];
}

export async function generateMetadata({
	params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
	"use cache";

	const { locale } = await params;
	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "unauthorized",
	});

	return {
		title: t("metaTitle"),
	};
}

export default async function Page({ params }: LayoutProps<"/[locale]">) {
	"use cache";

	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";

	return (
		<Forbidden
			model={newReadonlyModel({
				language,
				signOutEndpoint: "/",
			})}
		/>
	);
}
