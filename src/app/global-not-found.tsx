import "./globals.css";

import { newReadonlyModel } from "@mvc-react/mvc";
import { Metadata } from "next";
import { Suspense } from "react";
import { routing } from "../i18n/routing";
import NotFoundPage from "../lib/component/page/not-found/NotFound";
import ViewLoadingSkeleton from "../lib/component/view-loading-skeleton/ViewLoadingSkeleton";
import { googleSansFlex } from "../lib/third-party/fonts";

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }));
}

export const metadata: Metadata = {
	title: "404 - Resource not Found",
};

export default function NotFound() {
	const language = "en";
	return (
		<html lang={language} data-scroll-behavior="smooth">
			<body className={`antialiased ${googleSansFlex.className}`}>
				<Suspense fallback={<ViewLoadingSkeleton />}>
					<NotFoundPage model={newReadonlyModel({ language })} />
				</Suspense>
			</body>
		</html>
	);
}
