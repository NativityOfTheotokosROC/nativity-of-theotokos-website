import { routing } from "@/src/i18n/routing";
import { getDailySaint } from "@/src/lib/third-party/holytrinityorthodox";
import { getDateString } from "@/src/lib/utilities/date-time";
import { hasLocale } from "next-intl";
import { redirect } from "next/navigation";
import { locale as rootLocale } from "next/root-params";

// export async function generateMetadata(
// 	props: PageProps<"/[locale]/commemorations/[commemoration]">,
// ) {
//     const locale = await rootLocale();
// 	const language = hasLocale(routing.locales, locale) ? locale : "en";
// 	const date = getDateString(new Date());
// 	const dailySaint = await getDailySaint(new Date(date), language);

// 	return await commemorationMetadata({...props, params: { commemoration: dailySaint.id }});
// }

export default async function Page() {
	const locale = await rootLocale();
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const date = getDateString(new Date());
	const dailySaint = await getDailySaint(new Date(date), language);
	redirect(`/commemorations/${dailySaint.id}`);
}
