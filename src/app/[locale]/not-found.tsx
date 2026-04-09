import { routing } from "@/src/i18n/routing";
import NotFoundPage from "@/src/lib/component/page/not-found/NotFound";
import { newReadonlyModel } from "@mvc-react/mvc";
import { hasLocale } from "next-intl";

export default async function NotFound({ params }: LayoutProps<"/[locale]">) {
	"use cache";

	const { locale } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";

	return <NotFoundPage model={newReadonlyModel({ language })} />;
}
