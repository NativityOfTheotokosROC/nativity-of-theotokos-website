import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import NotFoundPage from "../lib/component/page/not-found/NotFound";
import { Metadata } from "next";
import { Suspense } from "react";
import { googleSansFlex } from "../lib/third-party/fonts";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../i18n/routing";

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }));
}

export const metadata: Metadata = {
	title: "Resource not Found",
};

export default function NotFound() {
	setRequestLocale("en");

	return (
		<html data-scroll-behavior="smooth">
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
