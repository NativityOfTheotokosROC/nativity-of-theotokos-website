import "./globals.css";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import NotFoundPage from "../lib/component/page/not-found/NotFound";
import { googleSansFlex } from "../lib/third-party/fonts";
import LayoutLoadingSkeleton from "../lib/component/layout-loading-skeleton/LayoutLoadingSkeleton";

export const metadata: Metadata = {
	title: "404 - Resource not Found",
};

export default async function NotFound() {
	const language = "en";
	setRequestLocale(language);
	const messages = await getMessages({ locale: language });

	return (
		<html lang={language} data-scroll-behavior="smooth">
			<body className={`antialiased ${googleSansFlex.className}`}>
				<Suspense fallback={<LayoutLoadingSkeleton />}>
					<NextIntlClientProvider
						locale={language}
						messages={messages}
					>
						<NotFoundPage model={newReadonlyModel({ language })} />
					</NextIntlClientProvider>
				</Suspense>
			</body>
		</html>
	);
}
