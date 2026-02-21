import "@/src/app/globals.css";
import { routing } from "@/src/i18n/routing";
import Footer from "@/src/lib/component/footer/Footer";
import Header from "@/src/lib/component/header/Header";
import LanguageSwitcher from "@/src/lib/component/language-switcher/LanguageSwitcher";
import PageLoadingBar from "@/src/lib/component/page-loading-bar/PageLoadingBar";
import { newReadonlyModel } from "@mvc-react/mvc";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ClientProviders from "./client-providers";
import { FooterModel } from "@/src/lib/model/footer";
import {
	googleSansFlex,
	googleSans,
	georgia,
} from "@/src/lib/third-party/fonts";

export async function generateMetadata({
	params,
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		throw new Error("Invalid locale");
	}
	const t = await getTranslations({
		locale,
		namespace: "metadata",
	});
	const titleTemplate = `%s | ${t("templateTitle")}`;
	const titleDefault = t("templateDefault");
	const description = t("description");
	const localeMetaData = locale == "en" ? "en-US" : "ru-RU";

	return {
		metadataBase: `https://nativityoftheotokos.com`,
		alternates: {
			canonical: "/",
			languages: {
				ru: "/ru",
			},
		},
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
			url: "/",
			description,
			locale: localeMetaData,
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
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	const tNavMenu = await getTranslations("navMenu");
	const tFooterVariable = await getTranslations("footer_variable");
	const tLinks = await getTranslations("links");
	const footer: FooterModel = newReadonlyModel({
		description: tFooterVariable("description"),
		parishEmail: "info@nativityoftheotokos.com",
		clergy: [
			{ name: tFooterVariable("frDimitri") },
			{ name: tFooterVariable("frSavva") },
		],
		jurisdictionInfo: {
			diocese: {
				name: tFooterVariable("diocese"),
				link: new URL(tLinks("diocese")).href,
			},
			metropolis: {
				name: tFooterVariable("jurisdiction"),
				link: new URL(tLinks("jurisdiction")).href,
			},
			patriarch: {
				name: tFooterVariable("patriarch"),
				link: new URL(tLinks("patriarch")).href,
			},
			patriarchate: {
				name: tFooterVariable("patriarchate"),
				link: new URL(tLinks("patriarchate")).href,
			},
		},
		contacts: [
			{ name: tFooterVariable("phone"), phone: "+263716063616" },
			{ name: tFooterVariable("vasily"), phone: "+263772473317" },
			{ name: tFooterVariable("larisa"), phone: "+263771389444" },
		],
		socials: [
			newReadonlyModel({
				details: {
					type: "Facebook",
					link: "https://facebook.com/people/Orthodox-Church-in-Zimbabwe-Moscow-Patriarchate/61577719142729",
				},
			}),
			newReadonlyModel({
				details: {
					type: "Instagram",
					link: "https://instagram.com/exarchate.mp",
				},
			}),
			newReadonlyModel({
				details: {
					type: "WhatsApp",
					link: "https://wa.me/263716063616",
				},
			}),
		],
		copyrightText: tFooterVariable("copyright"),
		licenses: [
			{
				precedingText: tFooterVariable("dailyReadingsLicense"),
				linkLabel: "Holy Trinity Orthodox",
				link: new URL(tLinks("holyTrinityChurch")).href,
			},
			{
				precedingText: tFooterVariable("logoIconLicense"),
				linkLabel: "Logoicon.com",
				link: new URL("https://logoicon.com").href,
			},
		],
	});

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body
				className={`antialiased ${googleSansFlex.variable} ${googleSans.variable} ${georgia.variable}`}
				suppressHydrationWarning
			>
				<NextIntlClientProvider>
					<ClientProviders>
						<PageLoadingBar />
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
										link: "/#resources",
										text: tNavMenu("aboutUs"),
										isReplaceable: true,
									},
									{
										link: "/#media",
										text: tNavMenu("media"),
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
						<Footer model={footer} />
						<LanguageSwitcher
							model={newReadonlyModel({ locale })}
						/>
					</ClientProviders>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
