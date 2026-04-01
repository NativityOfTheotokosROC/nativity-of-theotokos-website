import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Maintenance from "@/src/lib/component/page/maintenance/Maintenance";
import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/about-us">): Promise<Metadata> {
	"use cache";

	const { locale } = await params;
	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "aboutUs",
	});

	return {
		title: t("metaTitle"),
	};
}

export default function Page() {
	return <Maintenance />;
}
