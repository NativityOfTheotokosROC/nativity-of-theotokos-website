import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import NotFoundPage from "../lib/component/pages/not-found/NotFound";
import { Google_Sans_Flex } from "next/font/google";
import { Metadata } from "next";

const googleSansFlex = Google_Sans_Flex({
	subsets: ["latin"],
	variable: "--font-g-flex",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Resource not Found",
};

export default function NotFound() {
	return (
		<html data-scroll-behavior="smooth">
			<body className={`antialiased ${googleSansFlex.className}`}>
				<NextIntlClientProvider>
					<NotFoundPage />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
