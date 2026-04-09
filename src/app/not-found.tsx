import "./globals.css";

import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { routing } from "../i18n/routing";
import NotFoundPage from "../lib/component/page/not-found/NotFound";
import { googleSansFlex } from "../lib/third-party/fonts";

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }));
}

export const metadata: Metadata = {
	title: "Resource not Found",
};

export default function NotFound() {
	setRequestLocale("en");

	return (
		<html lang="en" data-scroll-behavior="smooth">
			<body className={`antialiased ${googleSansFlex.className}`}>
				<Suspense fallback={null}>
					<NextIntlClientProvider>
						<NotFoundPage />
					</NextIntlClientProvider>
				</Suspense>
			</body>
		</html>
	);
}
