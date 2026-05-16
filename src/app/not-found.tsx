import "./globals.css";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import NotFoundPage from "../lib/components/views/not-found/NotFound";
import { googleSansFlex } from "../lib/third-party/fonts";
import LayoutLoadingSkeleton from "../lib/components/layout-loading-skeleton/LayoutLoadingSkeleton";
import Error from "next/error";

export const metadata: Metadata = {
	title: "404 - Resource not Found",
};

export default async function NotFound() {
	const language = "en";
	const messages = await getMessages({ locale: language });
	setRequestLocale(language);

	return (
		<html lang={language} data-scroll-behavior="smooth">
			<body className={`antialiased ${googleSansFlex.className}`}>
				<Suspense fallback={<LayoutLoadingSkeleton />}>
					<Error statusCode={404}>
						<NextIntlClientProvider
							locale={language}
							messages={messages}
						>
							<NotFoundPage
								model={newReadonlyModel({ language })}
							/>
						</NextIntlClientProvider>
					</Error>
				</Suspense>
			</body>
		</html>
	);
}
