import ProtectedComponent from "@/src/lib/components/protected-component/ProtectedComponent";
import ManageQuotesClient from "@/src/lib/components/views/manage-quotes/client";
import {
	getAutoCompleteInfo,
	getQuotes,
	getScheduledQuotes,
} from "@/src/lib/server-only/quote";
import { getNativeTimeZone } from "@/src/lib/utilities/date-time";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { newReadonlyModel } from "@mvc-react/mvc";
import { toZonedTime } from "date-fns-tz";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]">): Promise<Metadata> {
	"use cache";

	const { locale } = await params;
	const t = await getTranslations({
		locale: isValidLocale(locale) ? locale : "en",
		namespace: "manageQuotes",
	});

	return {
		title: t("title"),
	};
}
export default async function Page() {
	await connection();
	const [quotes, scheduledQuotes, autoCompleteInfo] = [
		getQuotes(),
		getScheduledQuotes(toZonedTime(new Date(), getNativeTimeZone())),
		getAutoCompleteInfo(),
	];

	return (
		<ProtectedComponent model={newReadonlyModel({ roles: ["quotes"] })}>
			<ManageQuotesClient
				model={newReadonlyModel({
					quotes: await quotes,
					scheduledQuotes: await scheduledQuotes,
					autoCompleteInfo: await autoCompleteInfo,
				})}
			/>
		</ProtectedComponent>
	);
}
