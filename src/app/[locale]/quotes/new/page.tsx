import { routing } from "@/src/i18n/routing";
import { protect } from "@/src/lib/server-actions/auth";
import { getAutoCompleteInfo } from "@/src/lib/server-actions/quote";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import NewQuoteClient from "./client";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/quotes/new">): Promise<Metadata> {
	"use cache";

	const { locale } = await params;
	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "newQuote",
	});

	return {
		title: t("metaTitle"),
	};
}
export default async function Page() {
	await protect({ roles: ["quotes"] });
	const autoCompleteInfo = await getAutoCompleteInfo();
	console.log(autoCompleteInfo.existingAuthors);

	return <NewQuoteClient model={newReadonlyModel({ autoCompleteInfo })} />;
}
