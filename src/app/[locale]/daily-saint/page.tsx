import { DynamicMarker } from "@/src/lib/components/miscellaneous/utility";
import { getDailySaint } from "@/src/lib/third-party/holytrinityorthodox";
import { getDateString } from "@/src/lib/utilities/date-time";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { cacheLife } from "next/cache";
import { locale as rootLocale } from "next/root-params";
import { connection } from "next/server";
import CommemorationPage, {
	generateMetadata as commemorationMetadata,
} from "../commemorations/[commemoration]/page";

export async function generateMetadata(
	props: PageProps<"/[locale]/daily-saint">,
) {
	"use cache"; //TODO: Get back to this in the future
	cacheLife("minutes");

	const locale = await rootLocale();
	const language = isValidLocale(locale) ? locale : "en";
	const date = new Date(getDateString(new Date(), true));
	const dailySaint = await getDailySaint(date, language);

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
	const language = isValidLocale(locale) ? locale : "en";
	const date = new Date(getDateString(new Date(), true));
	const dailySaint = await getDailySaint(date, language);
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
