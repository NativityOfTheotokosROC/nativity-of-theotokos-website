import { routing } from "@/src/i18n/routing";
import {
	createTicket,
	getLatestUnsubmittedArticle,
} from "@/src/lib/server-actions/article";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import WriteArticleClient from "../../../lib/components/views/write-article/client";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "writeArticle",
	});
	return {
		title: t("metaTitle"),
	} satisfies Metadata;
}

export default async function Page() {
	const latestUnsubmittedArticle = await getLatestUnsubmittedArticle();
	const draft = latestUnsubmittedArticle?.draft ?? undefined;
	const currentArticle =
		latestUnsubmittedArticle?.currentArticle ?? undefined;
	const { ticketId, canDeleteTicket } =
		latestUnsubmittedArticle ?? (await createTicket({ useUnused: true }));

	return (
		<WriteArticleClient
			model={newReadonlyModel({
				ticketId,
				lastSavedDraft: draft,
				currentArticle,
				canDeleteTicket,
			})}
		/>
	);
}
