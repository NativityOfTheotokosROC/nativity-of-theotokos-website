import "@/src/app/globals.css";
import { routing } from "@/src/i18n/routing";
import PageLoading from "@/src/lib/component/page-loading/PageLoading";
import ClientProviders from "@/src/lib/provider/client-providers";
import {
	georgia,
	googleSans,
	googleSansFlex,
} from "@/src/lib/third-party/fonts";
import { newReadonlyModel } from "@mvc-react/mvc";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LocaleLayout from "./LocaleLayout";
import { Language } from "@/src/lib/type/miscellaneous";

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata(
	props: Omit<LayoutProps<"/[locale]">, "children">,
): Promise<Metadata> {
	const { locale } = await props.params;

	const t = await getTranslations({
		locale: locale as Language,
		namespace: "metadata",
	});
	const titleTemplate = `%s | ${t("templateTitle")}`;
	const titleDefault = t("templateDefault");
	const description = t("description");
	// const localeMetaData = locale == "en" ? "en-US" : "ru-RU";

	return {
		metadataBase:
			process.env.NODE_ENV == "development"
				? "http:localhost:3000"
				: `https://nativityoftheotokos.com`,
		// alternates: { //TODO: Opengraph and alernates mess up prerendering for some reason
		// 	canonical: "/",
		// 	languages: {
		// 		ru: "/ru",
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
			// 	url: "/",
			description,
			// 	// locale: localeMetaData,
			type: "website",
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
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	setRequestLocale(locale);

	return (
		<html lang={locale} data-scroll-behavior="smooth">
			<body
				className={`antialiased ${googleSansFlex.variable} ${googleSans.variable} ${georgia.variable}`}
			>
				<Suspense fallback={<PageLoading />}>
					<NextIntlClientProvider>
						<ClientProviders>
							<LocaleLayout model={newReadonlyModel({ locale })}>
								{children}
							</LocaleLayout>
						</ClientProviders>
					</NextIntlClientProvider>
				</Suspense>
			</body>
		</html>
	);
}
