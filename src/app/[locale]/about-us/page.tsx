import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Maintenance from "../maintenance/Maintenance";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "aboutUs" });

	return {
		title: t("metaTitle"),
	};
}

export default function Page() {
	return <Maintenance />;
}
