"use cache";

import NotFoundPage from "@/src/lib/component/page/not-found/NotFound";
import ViewLoadingSkeleton from "@/src/lib/component/view-loading-skeleton/ViewLoadingSkeleton";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Suspense } from "react";
import { locale as rootLocale } from "next/root-params";
import { routing } from "@/src/i18n/routing";
import { hasLocale } from "next-intl";

export default async function NotFound() {
	const locale = await rootLocale();
	const language = hasLocale(routing.locales, locale) ? locale : "en";

	return (
		<Suspense fallback={<ViewLoadingSkeleton />}>
			<NotFoundPage model={newReadonlyModel({ language })} />
		</Suspense>
	);
}
