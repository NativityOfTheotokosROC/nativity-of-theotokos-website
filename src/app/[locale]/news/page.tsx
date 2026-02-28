import { notFound } from "next/navigation";

// export async function generateMetadata({
// 	params,
// }: {
// 	params: { locale: string };
// }): Promise<Metadata> {
// 	const { locale } = await params;
// 	const t = await getTranslations({
// 		locale: hasLocale(routing.locales, locale) ? locale : "en",
// 		namespace: "news",
// 	});

// 	return {
// 		title: t("metaTitle"),
// 	};
// }

export default function Page() {
	notFound();
}
