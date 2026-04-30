import { usePathname, useRouter } from "@/src/i18n/navigation";
import { newReadonlyModel } from "@mvc-react/mvc";
import { UserActionModel } from "../models/user-action";
import { Path, Role } from "../types/general";
import { usePageLoadingBarRouter } from "../utilities/page-loading-bar";
import { getUserActionNames } from "../utilities/user-action";
import { useSignOut } from "./sign-out";

export function useUserActions(roles: Role[]) {
	const router = usePageLoadingBarRouter(useRouter);
	const pathname = usePathname();
	const signOut = useSignOut(pathname as Path, router);
	const actionNames = getUserActionNames(roles);
	return [...actionNames].map(actionName => {
		switch (actionName) {
			case "NEW_QUOTE": {
				return newReadonlyModel({
					name: "NEW_QUOTE",
					action: () => {
						router.push("/quotes/new");
					},
				});
			}
			case "NEW_ARTICLE": {
				return newReadonlyModel({
					name: "NEW_ARTICLE",
					action: () => {},
				});
			}
			case "SIGN_OUT": {
				return newReadonlyModel({
					name: "SIGN_OUT",
					action: async () => {
						await signOut.interact({
							type: "SIGN_OUT",
							input: { hardRefresh: true },
						});
					},
				});
			}
			default: {
				throw new Error(
					`Invalid action: ${actionName satisfies never}`,
				);
			}
		}
	}) satisfies UserActionModel[];
}
