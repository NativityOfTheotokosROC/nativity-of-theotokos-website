import { routing } from "@/src/i18n/routing";
import { getArticle, makeArticleEdit } from "@/src/lib/server-actions/article";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import WriteArticleClient from "../../../../../lib/components/views/write-article/client";
import { getUserInformation } from "@/src/lib/server-actions/user";
import ReviewArticleClient from "@/src/lib/components/views/review-article/client";
import { IS_AUTH_DISABLED } from "@/src/lib/utilities/server-constants";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : notFound();
	const t = await getTranslations({
		namespace: "writeArticle",
		locale: language,
	});
	return { title: t("metaTitle") } satisfies Metadata;
}

export default async function Page({
	params,
}: PageProps<"/[locale]/news/[article]">) {
	const { article: articleUri } = await params;
	if (!articleUri) notFound();
	const userInformation = await getUserInformation();
	if (
		IS_AUTH_DISABLED ||
		(userInformation &&
			(userInformation.roles.includes("admin") ||
				userInformation.roles.includes("editor")))
	) {
		const article = await getArticle(articleUri, "en"); // TODO: Modify function to include info for all locales in future
		return (
			<ReviewArticleClient
				model={newReadonlyModel({
					articleDraft: { title: article.title, body: article.body },
					article,
				})}
			/>
		);
	}
	const {
		ticketId,
		canDeleteTicket,
		draft: { title, body },
		currentArticle,
	} = await makeArticleEdit(articleUri);
	return (
		<WriteArticleClient
			model={newReadonlyModel({
				ticketId,
				canDeleteTicket,
				lastSavedDraft: { title, body },
				currentArticle,
			})}
		/>
	);
}
