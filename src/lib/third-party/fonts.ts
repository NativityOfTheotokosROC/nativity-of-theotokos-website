import { Google_Sans, Google_Sans_Flex } from "next/font/google";
import LocalFont from "next/font/local";

const googleSansFlex = Google_Sans_Flex({
	subsets: ["latin"],
	adjustFontFallback: false,
	variable: "--font-g-flex",
	display: "swap",
});

const googleSans = Google_Sans({
	subsets: ["cyrillic", "cyrillic-ext"],
	variable: "--font-g-sans",
	display: "swap",
});

const georgia = LocalFont({
	src: [
		{
			path: "../../../public/fonts/Georgia/Georgia.woff2",
		},
	],
	adjustFontFallback: false,
	variable: "--font-georgia",
	display: "swap",
});

export { googleSansFlex, googleSans, georgia };
