import { routing } from "@/src/i18n/routing";
import ProtectedComponent from "@/src/lib/component/protected-component/ProtectedComponent";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import NewQuoteClient from "./client";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
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
		<ProtectedComponent
			model={newReadonlyModel({
				signInEndpoint: "quotes/new",
				roles: ["quotes"],
			})}
		>
			<NewQuoteClient />
		</ProtectedComponent>
	);
}
