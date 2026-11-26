import ProtectedComponent from "@/src/lib/components/protected-component/ProtectedComponent";
import ArticleAuthorClient from "@/src/lib/components/views/article-author/client";
import { getArticleAuthorWithTranslations } from "@/src/lib/server-only/article";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	const { locale: localeParam } = await params;
	const locale = isValidLocale(localeParam) ? localeParam : "en";
	const t = await getTranslations({ namespace: "articleAuthor", locale });

	return { title: t("title") } satisfies Metadata;
}

export default async function Page({ searchParams }: PageProps<"/[locale]">) {
	const { uri } = await searchParams;
	let author = undefined;
	if (typeof uri === "string")
		author = getArticleAuthorWithTranslations({ uri });

	return (
		<ProtectedComponent model={newReadonlyModel({ roles: ["editor"] })}>
			<ArticleAuthorClient
				model={newReadonlyModel({ author: await author })}
			/>
		</ProtectedComponent>
	);
}
