import EmptyNotifications from "@/src/lib/components/views/empty-notifications/EmptyNotifications";
import { getNotifications } from "@/src/lib/server-actions/user-notification";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	const language = isValidLocale(locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "notifications",
	});
	return { title: t("metaTitle") };
}

export default async function Page() {
	await getNotifications();
	return <EmptyNotifications />;
}
