import { routing } from "@/src/i18n/routing";
import {
	createTicket,
	getLatestUnsubmittedDraft,
} from "@/src/lib/server-actions/article";
import { getUser } from "@/src/lib/server-actions/auth";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import NewArticleClient from "./client";
import {
	ENVIRONMENT,
	PREPRODUCTION_PROTECTION,
} from "@/src/lib/utilities/server-constants";

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
	const authorEmail =
		(user?.email ??
		(PREPRODUCTION_PROTECTION === "disabled" &&
			ENVIRONMENT !== "production"))
			? "editorial@nativityoftheotokos.com"
			: undefined;
	const latestUnsubmittedDraft = await getLatestUnsubmittedDraft(authorEmail);
	const ticketId = latestUnsubmittedDraft
		? latestUnsubmittedDraft.ticketId
		: (await createTicket({ userEmail: authorEmail, useUnused: true }))
				.ticketId;

	return (
		<NewArticleClient
			model={newReadonlyModel({
				ticketId,
				initialTitle: latestUnsubmittedDraft?.title,
				initialBody: latestUnsubmittedDraft?.body,
				author: user?.name,
			})}
		/>
	);
}
