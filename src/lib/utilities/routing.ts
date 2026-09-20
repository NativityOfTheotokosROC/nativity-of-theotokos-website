import "server-only";

import { Path } from "./types";

export function getProtectedRoutes() {
	const protectedRoutes = [
		"/admin",
		"/notifications",
		"/quotes/new",
		"/write-article", //TODO: Cater for /news/[slug]/edit too
		"/review-article",
		"/assign-article",
		"/scheduler",
	] as const;
	// This should do for now lol
	type ValidRoutes =
		PageProps<`/[locale]${(typeof protectedRoutes)[number]}`> extends never
			? never
			: typeof protectedRoutes;
	return new Set(protectedRoutes satisfies ValidRoutes);
}

export const redirects = new Map<Path, Path>(); // TODO
