import ProtectedComponent from "@/src/lib/components/protected-component/ProtectedComponent";
import AssignArticleClient from "@/src/lib/components/views/assign-article/client";
import { getArticleAuthors } from "@/src/lib/server-only/article";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	const { locale: localeParam } = await params;
	const locale = isValidLocale(localeParam) ? localeParam : "en";
	const t = await getTranslations({ namespace: "assignArticle", locale });

	return { title: t("metaTitle") } satisfies Metadata;
}

export default async function Page() {
	const articleAuthors = await getArticleAuthors();
	return (
		<ProtectedComponent model={newReadonlyModel({ roles: ["admin"] })}>
			<AssignArticleClient
				model={newReadonlyModel({ suggestions: articleAuthors })}
			/>
		</ProtectedComponent>
	);
}
