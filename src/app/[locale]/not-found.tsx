"use cache";

import { routing } from "@/src/i18n/routing";
import NotFoundPage from "@/src/lib/component/page/not-found/NotFound";
import { newReadonlyModel } from "@mvc-react/mvc";
import { hasLocale } from "next-intl";
import { locale as rootLocale } from "next/root-params";

export default async function NotFound() {
	const locale = await rootLocale();
	const language = hasLocale(routing.locales, locale) ? locale : "en";

	return (
		// <Suspense fallback={<ViewLoadingSkeleton />}>
		<NotFoundPage model={newReadonlyModel({ language })} />
		// </Suspense>
	);
}
