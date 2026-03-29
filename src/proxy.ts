import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const nextIntlMiddleware = createMiddleware(routing);

<<<<<<< HEAD
export default async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const user = await getUser();

	for (const route of getProtectedRoutes()) {
		if (pathname.endsWith(route) && !user) {
			const newUrl = new URL(
				`${req.nextUrl.origin}/sign-in?endpoint=${pathname}`,
			);
			return NextResponse.redirect(newUrl);
		}
=======
export default function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname == "/sitemap.xml" || pathname == "/robots.txt") {
		return NextResponse.next();
>>>>>>> 5c9aec14670165be3403774640efb1ce033dc4c3
	}

	return nextIntlMiddleware(req);
}

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: ["/((?!api|trpc|_next|_vercel|sitemap.xml|.*\\..*).*)"],
};
