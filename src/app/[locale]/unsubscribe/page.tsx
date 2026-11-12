import Unsubscribed from "@/src/lib/components/views/unsubscribed/Unsubscribed";
import { toggleSubscribe } from "@/src/lib/server-actions/email";
import { getContact } from "@/src/lib/server-only/email";
import { isValidLocale } from "@/src/lib/utilities/internationalization";
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
		namespace: "unsubscribe",
	});
	return { title: t("title") };
}

export default async function Page({ searchParams }: PageProps<"/[locale]">) {
	const { id } = await searchParams;
	if (typeof id !== "string") notFound();

	const contact = await getContact(id);
	if (!contact) notFound();
	await toggleSubscribe(id, false);

	return <Unsubscribed model={newReadonlyModel({ email: contact.email })} />;
}
