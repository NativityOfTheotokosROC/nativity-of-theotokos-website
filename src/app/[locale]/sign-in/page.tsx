import { routing } from "@/src/i18n/routing";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import SignInClient from "./client";
import { newReadonlyModel } from "@mvc-react/mvc";
import PageLoading from "@/src/lib/component/page-loading/PageLoading";
import { Suspense } from "react";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "signIn",
	});

	return {
		title: t("metaTitle"),
	};
}

export default function Page() {
	return (
		<Suspense fallback={<PageLoading />}>
			<SignInClient
				model={newReadonlyModel({
					signInServices: ["google", "yandex"],
				})}
			/>
		</Suspense>
	);
}
