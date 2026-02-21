import { getTranslations } from "next-intl/server";
import Forbidden from "./forbidden/Forbidden";
import { Metadata } from "next";
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
		namespace: "unauthorized",
	});

	return {
		title: t("metaTitle"),
	};
}

export default function Page() {
	return <Forbidden />;
}
