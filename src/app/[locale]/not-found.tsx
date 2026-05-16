import NotFoundView from "@/src/lib/components/views/not-found/NotFound";
import ViewLoadingSkeleton from "@/src/lib/components/view-loading-skeleton/ViewLoadingSkeleton";
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
			<NotFoundView model={newReadonlyModel({ language })} />
		</Suspense>
	);
}
