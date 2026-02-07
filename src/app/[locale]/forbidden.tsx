import { getTranslations } from "next-intl/server";
import Forbidden from "./forbidden/Forbidden";
import { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "unauthorized" });

	return {
		title: t("metaTitle"),
	};
}

export default function Page() {
	return <Forbidden />;
}
