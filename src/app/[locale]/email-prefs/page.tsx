import EmailPrefsClient from "@/src/lib/components/views/email-prefs/client";
import { getContact } from "@/src/lib/server-only/email";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
import { Language } from "@/src/lib/utilities/types";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: PageProps<"/[locale]">): Promise<Metadata> {
	const { locale } = await params;
	const language = isValidLocale(locale) ? locale : "en";
	const t = await getTranslations({
		locale: language,
		namespace: "emailPrefs",
	});
	return { title: t("title") };
}

export default async function Page({ searchParams }: PageProps<"/[locale]">) {
	const { id } = await searchParams;
	if (typeof id !== "string") notFound();

	const contact = await getContact(id);
	if (!contact) notFound();
	const { email, unsubscribed, first_name, last_name, properties } = contact;

	return (
		<EmailPrefsClient
			model={newReadonlyModel({
				contact: { id, email },
				prefs: {
					isUnsubscribed: unsubscribed,
					preferredLang: properties.preferredLang.value as Language,
					firstName: first_name ?? undefined,
					lastName: last_name ?? undefined,
				},
			})}
		/>
	);
}
