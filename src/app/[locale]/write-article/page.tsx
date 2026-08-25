import {
	assignArticle,
	getLatestUnsubmittedArticle,
} from "@/src/lib/server-actions/article";
import { getUserInformation } from "@/src/lib/server-actions/user";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { forbidden } from "next/navigation";
import WriteArticleClient from "../../../lib/components/views/write-article/client";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	const language = isValidLocale(locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "writeArticle",
	});
	return {
		title: t("metaTitle"),
	} satisfies Metadata;
}

export default async function Page() {
	const userEmail = (await getUserInformation())?.email;
	if (!userEmail) forbidden();
	const latestUnsubmittedArticle = await getLatestUnsubmittedArticle();
	const draft = latestUnsubmittedArticle?.draft ?? undefined;
	const currentArticle =
		latestUnsubmittedArticle?.currentArticle ?? undefined;
	const { ticketId, canDeleteTicket } =
		latestUnsubmittedArticle ??
		(await assignArticle(userEmail, { useUnused: true }));

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
