import { AppRoutes } from "@/.next/dev/types/routes";

type Routes = Exclude<AppRoutes extends `/[locale]${infer A}` ? A : never, "">;

export function getProtectedRoutes() {
	return ["/quotes/new", "/admin"] satisfies Routes[];
}
