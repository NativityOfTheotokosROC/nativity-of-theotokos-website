import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NotFoundPage from "./not-found-page/NotFoundPage";
import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "notFound",
	});

	return {
		title: t("metaTitle"),
	};
}

export default function NotFound() {
	return <NotFoundPage />;
}
