import "./globals.css";

import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Suspense } from "react";
import { routing } from "../i18n/routing";
import NotFoundPage from "../lib/component/page/not-found/NotFound";
import ViewLoadingSkeleton from "../lib/component/view-loading-skeleton/ViewLoadingSkeleton";
import ClientProviders from "../lib/provider/client-providers";
import { googleSansFlex } from "../lib/third-party/fonts";

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }));
}

export const metadata: Metadata = {
	title: "404 - Resource not Found",
};

export default async function NotFound() {
	const language = "en";
	const messages = await getMessages({ locale: language });

	return (
		<html lang={language} data-scroll-behavior="smooth">
			<body className={`antialiased ${googleSansFlex.className}`}>
				<Suspense fallback={<ViewLoadingSkeleton />}>
					<NextIntlClientProvider
						locale={language}
						messages={messages}
					>
						<ClientProviders>
							<NotFoundPage
								model={newReadonlyModel({ language })}
							/>
						</ClientProviders>
					</NextIntlClientProvider>
				</Suspense>
			</body>
		</html>
	);
}
