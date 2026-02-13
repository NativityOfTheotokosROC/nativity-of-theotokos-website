import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import NotFoundPage from "./[locale]/not-found-page/NotFoundPage";
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
		<html>
			<body
				className={`antialiased ${googleSansFlex.className}`}
				suppressHydrationWarning
			>
				<NextIntlClientProvider>
					<NotFoundPage />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
