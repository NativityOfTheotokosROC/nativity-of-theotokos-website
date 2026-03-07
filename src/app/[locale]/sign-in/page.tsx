import { routing } from "@/src/i18n/routing";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import SignInClient from "./client";
import { newReadonlyModel } from "@mvc-react/mvc";

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

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	const endpoint = (await searchParams).endpoint;

	return (
		<SignInClient
			model={newReadonlyModel({
				endpoint: endpoint != undefined ? endpoint : "",
				signInServices: ["google", "yandex"],
			})}
		/>
	);
}
