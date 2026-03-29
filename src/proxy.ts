import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const nextIntlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname == "/sitemap.xml" || pathname == "/robots.txt") {
		return NextResponse.next();
	}

	return nextIntlMiddleware(req);
}

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: ["/((?!api|trpc|_next|_vercel|sitemap.xml|.*\\..*).*)"],
};
