import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getProtectedRoutes } from "./lib/utility/auth";
import { getUser } from "./lib/server-action/auth";

const nextIntlMiddleware = createMiddleware(routing);

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
	}

	return nextIntlMiddleware(req);
}

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: ["/((?!api|trpc|_next|_vercel|sitemap.xml|.*\\..*).*)"],
};
