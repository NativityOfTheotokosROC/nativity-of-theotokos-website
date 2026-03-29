import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const nextIntlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/sitemap") || pathname.startsWith("/robots"))
		return NextResponse.next();

	return nextIntlMiddleware(req);
}

export const config = {
	// idk
	matcher: ["/", `/(en|ru)/:path*`],
};
