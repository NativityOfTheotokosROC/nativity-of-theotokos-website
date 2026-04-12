import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getProtectedRoutes, redirects } from "./lib/utility/routing";
import { getUser } from "./lib/server-action/auth";
import { Path } from "./lib/type/general";

const nextIntlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
	const { pathname, searchParams } = req.nextUrl;
	const user = await getUser();

	if (pathname.endsWith("/sign-in") && user) {
		return NextResponse.redirect(`${req.nextUrl.origin}
			${
				searchParams.get("endpoint")?.startsWith("/")
					? searchParams.get("endpoint")
					: "/"
			}`);
	}

	for (const route of getProtectedRoutes()) {
		if (pathname.endsWith(route) && !user) {
			const newUrl = new URL(
				`${req.nextUrl.origin}/sign-in?endpoint=${pathname}`,
			);
			return NextResponse.redirect(newUrl);
		}
	}
	const redirectPath = redirects.get(pathname as Path);
	if (redirectPath)
		return NextResponse.redirect(req.nextUrl.origin + redirectPath);

	return nextIntlMiddleware(req);
}

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: ["/((?!api|trpc|_next|_vercel|sitemap.xml|.*\\..*).*)"],
};
