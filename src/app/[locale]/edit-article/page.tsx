import { routing } from "@/src/i18n/routing";
import {
	createTicket,
	getLatestUnsubmittedArticle,
} from "@/src/lib/server-actions/article";
import { getUser } from "@/src/lib/server-actions/auth";
import { IS_AUTH_DISABLED } from "@/src/lib/utilities/server-constants";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import EditArticleClient from "../../../lib/components/views/edit-article/client";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "editArticle",
	});
	return {
		title: t("metaTitle"),
	} satisfies Metadata;
}

export default async function Page() {
	const user = await getUser();
	const authorEmail =
		user?.email ??
		(IS_AUTH_DISABLED ? "editorial@nativityoftheotokos.com" : undefined);
	const latestUnsubmittedArticle =
		await getLatestUnsubmittedArticle(authorEmail);
	const draft = latestUnsubmittedArticle?.draft ?? undefined;
	const currentArticle =
		latestUnsubmittedArticle?.currentArticle ?? undefined;
	const ticketId = latestUnsubmittedArticle
		? latestUnsubmittedArticle.ticketId
		: (await createTicket({ userEmail: authorEmail, useUnused: true }))
				.ticketId;

	return (
		<EditArticleClient
			model={newReadonlyModel({
				ticketId,
				lastSavedDraft: draft,
				currentArticle,
				author: user?.name,
			})}
		/>
	);
}
