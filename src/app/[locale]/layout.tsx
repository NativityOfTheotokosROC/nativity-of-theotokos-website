import "@/src/app/globals.css";
import { routing } from "@/src/i18n/routing";
import LayoutLoadingSkeleton from "@/src/lib/component/layout-loading-skeleton/LayoutLoadingSkeleton";
import ClientProviders from "@/src/lib/provider/client-providers";
import {
	georgia,
	googleSans,
	googleSansFlex,
} from "@/src/lib/third-party/fonts";
import { Language } from "@/src/lib/type/general";
import { newReadonlyModel } from "@mvc-react/mvc";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
	getMessages,
	getTranslations,
	setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AppLayout from "./AppLayout";
import { BASE_URL } from "@/src/lib/utility/server-constant";

export function generateStaticParams() {
	return [{ locale: "en" }, { locale: "ru" }];
}

export async function generateMetadata(
	props: Omit<LayoutProps<"/[locale]">, "children">,
): Promise<Metadata> {
	"use cache";

	const { locale } = await props.params;

	const t = await getTranslations({
		locale: locale as Language,
		namespace: "metadata",
	});
	const titleTemplate = `%s | ${t("templateTitle")}`;
	const titleDefault = t("templateDefault");
	const description = t("description");
	const localeMetaData = locale == "en" ? "en-US" : "ru-RU";

	return {
		metadataBase: BASE_URL,
		// alternates: {
		// 	canonical: BASE_URL,
		// 	languages: {
		// 		en: BASE_URL,
		// 		ru: BASE_URL + "/ru",
		// 	},
		// },
		title: {
			template: titleTemplate,
			default: titleDefault,
		},
		description,
		openGraph: {
			title: {
				template: titleTemplate,
				default: titleDefault,
			},
			// url: BASE_URL,
			description,
			locale: localeMetaData,
			type: "website",
			images: ["/opengraph-image.jpg"],
		},
		twitter: {
			card: "summary",
			title: { template: titleTemplate, default: titleDefault },
			description,
			images: ["/opengraph-image.jpg"],
		},
	};
}

export default async function RootLayout({
	children,
	params,
}: LayoutProps<"/[locale]">) {
	"use cache";

	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	setRequestLocale(locale);
	const messages = await getMessages({ locale });

	return (
		<html lang={locale} data-scroll-behavior="smooth">
			<body
				className={`antialiased ${googleSansFlex.variable} ${googleSans.variable} ${georgia.variable}`}
			>
				<Suspense fallback={<LayoutLoadingSkeleton />}>
					<NextIntlClientProvider locale={locale} messages={messages}>
						<ClientProviders>
							<AppLayout
								model={newReadonlyModel({ language: locale })}
							>
								{children}
							</AppLayout>
						</ClientProviders>
					</NextIntlClientProvider>
				</Suspense>
			</body>
		</html>
	);
}
