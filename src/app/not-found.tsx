import { Metadata } from "next";
import { googleSansFlex } from "../lib/third-party/fonts";
import "./globals.css";

export const metadata: Metadata = {
	title: "404 - Resource not Found",
};

export default async function NotFound() {
	const language = "en";
	// const messages = await getMessages({ locale: language });
	// setRequestLocale(language);

	return (
		<html lang={language} data-scroll-behavior="smooth">
			<body className={`antialiased ${googleSansFlex.className}`}>
				Not Found
				{/* <Suspense fallback={<LayoutLoadingSkeleton />}>
					<NextIntlClientProvider
						locale={language}
						messages={messages}
					>
						<NotFoundPage model={newReadonlyModel({ language })} />
					</NextIntlClientProvider>
				</Suspense> */}
			</body>
		</html>
	);
}
