import type { Metadata } from "next";
import "./globals.css";
import Header from "../lib/component/header/Header";
import { newReadonlyModel } from "@mvc-react/mvc";
import Footer from "../lib/component/footer/Footer";

export const metadata: Metadata = {
	title: {
		template: "%s | Nativity of the Theotokos Church",
		default: "Welcome | Nativity of the Theotokos Church",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<Header
					model={newReadonlyModel({
						title: "Nativity of the Theotokos Russian Orthodox Church",
						navlinks: [
							{ link: "/", text: "Home" },
							{ link: "/", text: "Our Parish" },
							{ link: "/", text: "Resources" },
							{ link: "/", text: "Media" },
							{ link: "/", text: "Contact" },
						],
					})}
				/>
				{children}
				<Footer
					model={newReadonlyModel({
						copyrightText:
							"2025 Providence Universal Studios. All Rights Reserved.",
					})}
				/>
			</body>
		</html>
	);
}
