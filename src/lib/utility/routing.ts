import "server-only";

import { ENVIRONMENT } from "./server-constant";
import { Path } from "../type/general";

export function getProtectedRoutes() {
	const protectedRoutes =
		ENVIRONMENT == "production"
			? (["/quotes/new", "/admin"] as const)
			: ([] as const);
	// This should do for now lol
	type TypeVerify =
		PageProps<`/[locale]${(typeof protectedRoutes)[number]}`> extends never
			? never
			: typeof protectedRoutes;
	return new Set(protectedRoutes satisfies TypeVerify);
}

export const redirects = new Map<Path, Path>(); // TODO
