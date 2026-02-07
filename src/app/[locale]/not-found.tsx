import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NotFound from "./not-found/NotFound";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "notFound" });

	return {
		title: t("metaTitle"),
	};
}

export default function Page() {
	return <NotFound />;
}
