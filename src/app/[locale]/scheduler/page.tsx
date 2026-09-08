import ProtectedComponent from "@/src/lib/components/protected-component/ProtectedComponent";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	const { locale: rawLocale } = await params;
	const locale = isValidLocale(rawLocale) ? rawLocale : "en";
	const t = await getTranslations({ namespace: "scheduler", locale });
	return {
		title: t("title"),
	} satisfies Metadata;
}

export default async function Page() {
	return (
		<ProtectedComponent model={newReadonlyModel({ roles: ["admin"] })}>
			<></>
		</ProtectedComponent>
	);
}
