import { routing } from "@/src/i18n/routing";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import NewArticle from "./NewArticle";
import { newReadonlyModel } from "@mvc-react/mvc";
import ProtectedComponent from "@/src/lib/components/protected-component/ProtectedComponent";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "newArticle",
	});
	return {
		title: t("metaTitle"),
	} satisfies Metadata;
}

export default async function Page({ params }: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";

	return (
		<ProtectedComponent model={newReadonlyModel({ roles: ["writer"] })}>
			<NewArticle model={newReadonlyModel({ language })} />
		</ProtectedComponent>
	);
}
