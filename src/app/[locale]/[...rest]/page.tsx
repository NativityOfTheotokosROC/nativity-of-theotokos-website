import { Language } from "@/src/lib/type/general";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";

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
