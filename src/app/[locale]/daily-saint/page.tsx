import { routing } from "@/src/i18n/routing";
import { DynamicMarker } from "@/src/lib/components/miscellaneous/utility";
import { getDailySaint } from "@/src/lib/third-party/holytrinityorthodox";
import { getDateString } from "@/src/lib/utilities/date-time";
import { hasLocale } from "next-intl";
import { locale as rootLocale } from "next/root-params";
import { connection } from "next/server";
import CommemorationPage, {
	generateMetadata as commemorationMetadata,
} from "../commemorations/[commemoration]/page";

export async function generateMetadata(
	props: PageProps<"/[locale]/daily-saint">,
) {
	"use cache"; //TODO: Get back to this in the future
	const locale = await rootLocale();
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const date = getDateString(new Date());
	const dailySaint = await getDailySaint(new Date(date), language);

	return await commemorationMetadata({
		...props,
		params: Promise.resolve({
			locale: language,
			commemoration: dailySaint.id,
		}),
	});
}

export default async function Page(props: PageProps<"/[locale]/daily-saint">) {
	await connection();
	const locale = await rootLocale();
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const date = getDateString(new Date());
	const dailySaint = await getDailySaint(new Date(date), language);
	return (
		<>
			<CommemorationPage
				{...{
					...props,
					params: Promise.resolve({
						locale: language,
						commemoration: dailySaint.id,
					}),
				}}
			/>
			<DynamicMarker />
		</>
	);
}
