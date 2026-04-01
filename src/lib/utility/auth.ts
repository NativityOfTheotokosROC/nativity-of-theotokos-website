export function getProtectedRoutes() {
	const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
	const protectedRoutes =
		environment == "production"
			? (["/quotes/new", "/admin"] as const)
			: ([] as const);
	// This should do for now lol
	type TypeVerify =
		PageProps<`/[locale]${(typeof protectedRoutes)[number]}`> extends never
			? never
			: typeof protectedRoutes;
	return protectedRoutes satisfies TypeVerify;
}
