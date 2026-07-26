import { routing } from "@/src/i18n/routing";
import ProtectedComponent from "@/src/lib/components/protected-component/ProtectedComponent";
import { getUser } from "@/src/lib/server-actions/auth";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import NewArticleClient from "./client";

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

export default async function Page() {
	const user = await getUser();

	return (
		<ProtectedComponent model={newReadonlyModel({ roles: ["writer"] })}>
			<NewArticleClient
				model={newReadonlyModel({
					author: user?.name,
				})}
			/>
		</ProtectedComponent>
	);
}
