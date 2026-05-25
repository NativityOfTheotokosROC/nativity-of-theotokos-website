import "@/src/app/globals.css";
import { routing } from "@/src/i18n/routing";
import LayoutLoadingSkeleton from "@/src/lib/components/layout-loading-skeleton/LayoutLoadingSkeleton";
import AppProvider from "@/src/lib/providers/AppProvider";
import {
	georgia,
	googleSans,
	googleSansFlex,
} from "@/src/lib/third-party/fonts";
import { Language } from "@/src/lib/types/general";
import { BASE_URL } from "@/src/lib/utilities/server-constants";
import { newReadonlyModel } from "@mvc-react/mvc";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import {
	getMessages,
	getTranslations,
	setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AppLayout from "./AppLayout";

export function generateStaticParams() {
	return [{ locale: "en" }, { locale: "ru" }];
}

export async function generateMetadata(
	props: Omit<LayoutProps<"/[locale]">, "children">,
): Promise<Metadata> {
	// "use cache";

	const { locale } = await props.params;

	const t = await getTranslations({
		locale: locale as Language,
		namespace: "metadata",
	});
	const titleTemplate = `%s | ${t("templateTitle")}`;
	const titleDefault = t("templateDefault");
	return {
		metadataBase: BASE_URL,
		title: {
			template: titleTemplate,
			default: titleDefault,
		},
		keywords: [
			"eastern orthodox church",
			"mother of god",
			"virgin mary",
			"zimbabwe orthodox church",
			"russian orthodox",
			"nativity of the theotokos",
		],
		openGraph: {
			title: {
				template: titleTemplate,
				default: titleDefault,
			},
			siteName: titleDefault,
			locale: "en-US",
			alternateLocale: "ru-RU",
		},
		twitter: {
			title: { template: titleTemplate, default: titleDefault },
		},
	};
}

export default async function RootLayout({
	children,
	params,
}: LayoutProps<"/[locale]">) {
	// "use cache";

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
					<AppProvider model={newReadonlyModel({ locale, messages })}>
						<AppLayout
							model={newReadonlyModel({ language: locale })}
						>
							{children}
						</AppLayout>
					</AppProvider>
				</Suspense>
			</body>
		</html>
	);
}
