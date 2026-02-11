import type { Metadata } from "next";
import "../globals.css";
import Header from "../../lib/component/header/Header";
import { newReadonlyModel } from "@mvc-react/mvc";
import Footer from "../../lib/component/footer/Footer";
import { Google_Sans, Google_Sans_Flex } from "next/font/google";
import LanguageSwitcher from "../../lib/component/language-switcher/LanguageSwitcher";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import ClientProviders from "./client-providers";
import LoadingBar from "@/src/lib/component/loading-bar/LoadingBar";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: {
			template: `%s | ${t("templateTitle")}`,
			default: `${t("templateDefault")}`,
		},
	};
}

const googleSansFlex = Google_Sans_Flex({
	subsets: ["latin"],
	variable: "--font-g-flex",
	display: "swap",
});
const googleSans = Google_Sans({
	subsets: ["cyrillic", "cyrillic-ext"],
	variable: "--font-g-sans",
	display: "swap",
});

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	const tHeader = await getTranslations("header");
	const tFooter = await getTranslations("footer");
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body
				className={`antialiased ${googleSansFlex.variable} ${googleSans.variable}`}
			>
				<NextIntlClientProvider>
					<ClientProviders model={newReadonlyModel({ locale })}>
						<LoadingBar />
						<Header
							model={newReadonlyModel({
								title: `${tHeader("headerTitle")} ${tHeader("headerSubtitle")}`,
								navlinks: [
									{ link: "/", text: tHeader("home") },
									{
										link: "/#resources",
										text: tHeader("resources"),
										isInteractive: true,
									},
									{
										link: "/#media",
										text: tHeader("media"),
										isInteractive: true,
									},
									{
										link: "/#resources",
										text: tHeader("aboutUs"),
										isInteractive: true,
									},
									{
										link: "/#footer",
										text: tHeader("contact"),
										isInteractive: true,
									},
								],
							})}
						/>
						{children}
						<Footer
							model={newReadonlyModel({
								copyrightText: tFooter("copyright"),
							})}
						/>
						<LanguageSwitcher
							model={{
								modelView: {
									displayedLanguage:
										locale == "en" ? "ru" : "en",
								},
								interact: async () => {
									"use server";
								},
							}}
						/>
					</ClientProviders>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
