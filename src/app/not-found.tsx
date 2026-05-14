import "./globals.css";
import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import NotFoundPage from "../lib/components/views/not-found/NotFound";
import { googleSansFlex } from "../lib/third-party/fonts";
import LayoutLoadingSkeleton from "../lib/components/layout-loading-skeleton/LayoutLoadingSkeleton";

export const metadata: Metadata = {
	title: "404 - Resource not Found",
};

export default function NotFound() {
	const language = "en";
	setRequestLocale(language);

	return (
		<html lang={language} data-scroll-behavior="smooth">
			<body className={`antialiased ${googleSansFlex.className}`}>
				<Suspense fallback={<LayoutLoadingSkeleton />}>
					<NextIntlClientProvider locale={language}>
						<NotFoundPage model={newReadonlyModel({ language })} />
					</NextIntlClientProvider>
				</Suspense>
			</body>
		</html>
	);
}
