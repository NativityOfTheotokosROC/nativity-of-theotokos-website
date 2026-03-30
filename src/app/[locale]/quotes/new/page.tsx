import { routing } from "@/src/i18n/routing";
import ProtectedComponent from "@/src/lib/component/protected-component/ProtectedComponent";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import NewQuoteClient from "./client";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/quotes/new">): Promise<Metadata> {
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
				roles: ["quotes"],
			})}
		>
			<NewQuoteClient />
		</ProtectedComponent>
	);
}
