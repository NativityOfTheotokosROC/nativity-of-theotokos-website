import { routing } from "@/src/i18n/routing";
import { getCommemoration } from "@/src/lib/third-party/holytrinityorthodox";
import { removeMarkup } from "@/src/lib/utilities/miscellaneous";
import { BASE_URL } from "@/src/lib/utilities/server-constants";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import Commemoration from "./Commemoration";
import { getPlaceholder } from "@/src/lib/server-only/placeholder";

export function generateStaticParams() {
	return routing.locales.map(locale => ({
		commemoration: "December_25-01",
		locale,
	}));
}

export async function generateMetadata({
	params,
}: PageProps<"/[locale]/commemorations/[commemoration]">): Promise<Metadata> {
	const { locale, commemoration: commemorationId } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const commemoration = await getCommemoration(commemorationId, language);
	if (!commemoration) notFound();
	const { title, icon, body, feastDays, id } = commemoration;
	const description = `${feastDays}\n\n${removeMarkup(body.substring(0, 127)).trim() + "..."}`;
	const images = icon ? [icon.source] : undefined;

	return {
		title,
		description,
		alternates: {
			canonical: `/commemorations/${id}`,
			languages: {
				ru: `/ru/commemorations/${id}`,
			},
		},
		openGraph: {
			title,
			description,
			url: `/commemorations/${id}`,
			images,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images,
		},
	};
}

export default async function Page({
	params,
}: PageProps<"/[locale]/commemorations/[commemoration]">) {
	const { locale, commemoration: commemorationId } = await params;
	const language = hasLocale(routing.locales, locale) ? locale : "en";
	const commemoration = await getCommemoration(commemorationId, language);
	if (!commemoration) notFound();
	const { title, feastDays, icon, body, id } = commemoration;
	const iconPlaceholder = icon
		? await getPlaceholder(icon.source)
		: undefined;
	const newIcon = icon
		? ({ ...icon, placeholder: iconPlaceholder } satisfies typeof icon)
		: undefined;

	return (
		<>
			<Commemoration
				model={newReadonlyModel({
					commemoration: {
						title,
						feastDays,
						body,
						id,
						icon: newIcon,
					},
					permalink: `${BASE_URL}${language == "ru" ? "/ru/" : "/"}commemorations/${id}`,
				})}
			/>
		</>
	);
}
