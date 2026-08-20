import { routing } from "@/src/i18n/routing";
import {
	assignArticle,
	getLatestUnsubmittedArticle,
} from "@/src/lib/server-actions/article";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import WriteArticleClient from "../../../lib/components/views/write-article/client";
import { getUser } from "@/src/lib/server-actions/auth";
import { DEFAULT_PREVIEW_USER_EMAIL } from "@/src/lib/utilities/constants";
import { IS_AUTH_DISABLED } from "@/src/lib/utilities/server-constants";
import { forbidden } from "next/navigation";
import ProtectedComponent from "@/src/lib/components/protected-component/ProtectedComponent";

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
	const userEmail = IS_AUTH_DISABLED
		? DEFAULT_PREVIEW_USER_EMAIL
		: (await getUser())?.email;
	if (!userEmail) forbidden();
	const latestUnsubmittedArticle = await getLatestUnsubmittedArticle();
	const draft = latestUnsubmittedArticle?.draft ?? undefined;
	const currentArticle =
		latestUnsubmittedArticle?.currentArticle ?? undefined;
	const { ticketId, canDeleteTicket } =
		latestUnsubmittedArticle ??
		(await assignArticle(userEmail, { useUnused: true }));

	return (
		<ProtectedComponent model={newReadonlyModel({ roles: ["writer"] })}>
			<WriteArticleClient
				model={newReadonlyModel({
					ticketId,
					lastSavedDraft: draft,
					currentArticle,
					canDeleteTicket,
				})}
			/>
		</ProtectedComponent>
	);
}
