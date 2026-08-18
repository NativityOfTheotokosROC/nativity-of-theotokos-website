import "server-only";

import { ENVIRONMENT, PREPRODUCTION_PROTECTION } from "./server-constants";
import { Path } from "../types/general";

export function getProtectedRoutes() {
	const protectedRoutes =
		ENVIRONMENT !== "production" &&
		PREPRODUCTION_PROTECTION?.toLowerCase() === "disabled"
			? ([] as const)
			: ([
					"/admin",
					"/notifications",
					"/quotes/new",
					"/write-article", //TODO: Cater for /news/[slug]/edit too
					"/review-article",
				] as const);
	// This should do for now lol
	type TypeVerify =
		PageProps<`/[locale]${(typeof protectedRoutes)[number]}`> extends never
			? never
			: typeof protectedRoutes;
	return new Set(protectedRoutes satisfies TypeVerify);
}

export const redirects = new Map<Path, Path>(); // TODO
