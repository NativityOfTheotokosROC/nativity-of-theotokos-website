import { routing } from "@/src/i18n/routing";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import SignInClient from "./client";
import { getUser } from "@/src/lib/server-action/auth";
import { redirect } from "next/navigation";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/sign-in">): Promise<Metadata> {
	"use cache";

	const { locale } = await params;
	const t = await getTranslations({
		locale: hasLocale(routing.locales, locale) ? locale : "en",
		namespace: "signIn",
	});

	return {
		title: t("metaTitle"),
	};
}

export default async function Page(props: PageProps<"/[locale]/sign-in">) {
	const searchParams = await props.searchParams;
	const signInEndpoint =
		typeof searchParams.endpoint == "string" ? searchParams.endpoint : "/";
	const user = await getUser();

	if (user) redirect(signInEndpoint);

	return (
		<SignInClient
			model={newReadonlyModel({
				signInEndpoint,
				signInServices: ["google", "yandex"],
			})}
		/>
	);
}
