import LocalFont from "next/font/local";

const googleSansFlex = LocalFont({
	src: [
		{
			path: "../../../public/fonts/GoogleSansFlex/GoogleSansFlex-Var.ttf",
		},
	],
	adjustFontFallback: false,
	variable: "--font-g-flex",
	display: "swap",
});

const googleSans = LocalFont({
	src: [{ path: "../../../public/fonts/GoogleSans/GoogleSans-Var.ttf" }],
	variable: "--font-g-sans",
	display: "swap",
});

const georgia = LocalFont({
	src: [{ path: "../../../public/fonts/Georgia/georgia.ttf" }],
	variable: "--font-georgia",
	display: "swap",
});

export { googleSansFlex, googleSans, georgia };
