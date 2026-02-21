import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Maintenance from "../maintenance/Maintenance";
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
		namespace: "aboutUs",
	});

	return {
		title: t("metaTitle"),
	};
}

export default function Page() {
	return <Maintenance />;
}
