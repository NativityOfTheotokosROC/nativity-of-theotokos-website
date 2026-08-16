import ReviewArticleClient from "@/src/lib/components/views/review-article/client";
import { getPendingArticleSubmission } from "@/src/lib/server-actions/article";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	const language = isValidLocale(locale) ? locale : "en";
	const t = await getTranslations({
		namespace: "reviewArticle",
		locale: language,
	});
	return {
		title: t("title"),
	} satisfies Metadata;
}

export default async function Page() {
	const pendingArticleSubmission = await getPendingArticleSubmission();
	if (!pendingArticleSubmission) notFound(); //TODO: Replace
	const { ticket, draft, currentArticle } = pendingArticleSubmission;
	return (
		<ReviewArticleClient
			model={newReadonlyModel({
				articleTicket: ticket,
				articleDraft: draft,
				article: currentArticle,
			})}
		/>
	);
}
