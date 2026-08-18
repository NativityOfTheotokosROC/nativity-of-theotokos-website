import { routing } from "@/src/i18n/routing";
import { makeArticleEdit } from "@/src/lib/server-actions/article";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import EditArticleClient from "../../../../../lib/components/views/edit-article/client";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : notFound();
	const t = await getTranslations({
		namespace: "editArticle",
		locale: language,
	});
	return { title: t("metaTitle") } satisfies Metadata;
}

export default async function Page({
	params,
}: PageProps<"/[locale]/news/[article]">) {
	const { article } = await params;
	if (!article) notFound();
	const {
		ticketId,
		canDeleteTicket,
		draft: { title, body },
		currentArticle,
	} = await makeArticleEdit(article);
	return (
		<EditArticleClient
			model={newReadonlyModel({
				ticketId,
				canDeleteTicket,
				lastSavedDraft: { title, body },
				currentArticle,
			})}
		/>
	);
}
