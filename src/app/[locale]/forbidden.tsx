import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";
import ForbiddenClient from "../../lib/component/pages/forbidden/client";
import { newReadonlyModel } from "@mvc-react/mvc";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
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
	return (
		<ForbiddenClient
			model={newReadonlyModel({
				signOutEndpoint: "/",
			})}
		/>
	);
}
