export function getProtectedRoutes() {
	const protectedRoutes = ["/quotes/new", "/admin"] as const;
	// This should do for now lol
	type TypeVerify =
		PageProps<`/[locale]${(typeof protectedRoutes)[number]}`> extends never
			? never
			: typeof protectedRoutes;
	return protectedRoutes satisfies TypeVerify;
}
