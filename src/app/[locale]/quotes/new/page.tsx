import { Metadata } from "next";
import NewQuoteClient from "./client";
import { getProtectedResource } from "@/src/lib/server-action/auth";
import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import PageLoading from "@/src/lib/component/page-loading/PageLoading";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "newQuote",
	});

	return {
		title: t("metaTitle"),
	};
}
export default function Page() {
    return (
		<Suspense fallback={<PageLoading />}>
		    <Protected />
		</Suspense>
	)
}

async function Protected() {
    return await getProtectedResource(() => <NewQuoteClient />, "quotes/new")
}
