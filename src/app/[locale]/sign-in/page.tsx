import { routing } from "@/src/i18n/routing";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import SignInClient from "./client";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
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
		<SignInClient
			model={newReadonlyModel({
				signInServices: ["google", "yandex"],
			})}
		/>
	);
}
