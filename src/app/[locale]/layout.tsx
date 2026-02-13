import { routing } from "@/src/i18n/routing";
import Footer from "@/src/lib/component/footer/Footer";
import Header from "@/src/lib/component/header/Header";
import LanguageSwitcher from "@/src/lib/component/language-switcher/LanguageSwitcher";
import LoadingBar from "@/src/lib/component/loading-bar/LoadingBar";
import { newReadonlyModel } from "@mvc-react/mvc";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Google_Sans, Google_Sans_Flex } from "next/font/google";
import { notFound } from "next/navigation";
import "@/src/app/globals.css";
import ClientProviders from "./client-providers";

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
	const tNavMenu = await getTranslations("navMenu");

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body
				className={`antialiased ${googleSansFlex.variable} ${googleSans.variable}`}
				suppressHydrationWarning
			>
				<NextIntlClientProvider>
					<ClientProviders>
						<LoadingBar />
						<Header
							model={newReadonlyModel({
								navlinks: [
									{ link: "/", text: tNavMenu("home") },
									{
										link: "/#resources",
										text: tNavMenu("resources"),
										isReplaceable: true,
									},
									{
										link: "/#media",
										text: tNavMenu("media"),
										isReplaceable: true,
									},
									{
										link: "/#resources",
										text: tNavMenu("aboutUs"),
										isReplaceable: true,
									},
									{
										link: "/#footer",
										text: tNavMenu("contact"),
										isReplaceable: true,
									},
								],
							})}
						/>
						{children}
						<Footer />
						<LanguageSwitcher
							model={newReadonlyModel({ locale })}
						/>
					</ClientProviders>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
