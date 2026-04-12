import { notFound } from "next/navigation";

// export async function generateMetadata(): Promise<Metadata> {
// 	"use cache";

// 	const { locale } = await rootLocale();

// 	const t = await getTranslations({
// 		locale: locale as Language,
// 		namespace: "notFound",
// 	});

// 	return { title: t("metaTitle") };
// }

export default function Page() {
	notFound();
}
