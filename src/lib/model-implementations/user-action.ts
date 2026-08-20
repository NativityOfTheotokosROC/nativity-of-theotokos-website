import { usePathname } from "@/src/i18n/navigation";
import { newReadonlyModel } from "@mvc-react/mvc";
import { UserActionModel } from "../models/user-action";
import { Path } from "../types/general";
import { usePageLoadingBarRouter } from "../utilities/page-loading-bar";
import { useUserInformation } from "../utilities/user";
import { getUserActionNames } from "../utilities/user-action";
import { useSignOut } from "./sign-out";

export function useUserActions() {
	const userInformation = useUserInformation();
	const router = usePageLoadingBarRouter();
	const pathname = usePathname();
	const signOut = useSignOut(pathname as Path);

	if (!userInformation || userInformation === "pending") return [];
	const actionNames = getUserActionNames(userInformation.roles);

	return [...actionNames].map(actionName => {
		switch (actionName) {
			case "NOTIFICATIONS": {
				return newReadonlyModel({
					name: "NOTIFICATIONS",
					action: () => {
						router.push("/notifications");
					},
				});
			}
			case "NEW_QUOTE": {
				return newReadonlyModel({
					name: "NEW_QUOTE",
					action: () => {
						router.push("/quotes/new");
					},
				});
			}
			case "WRITE_ARTICLE": {
				return newReadonlyModel({
					name: "WRITE_ARTICLE",
					action: () => {
						router.push("/write-article");
					},
				});
			}
			case "REVIEW_ARTICLE": {
				return newReadonlyModel({
					name: "REVIEW_ARTICLE",
					action: () => {
						router.push("/review-article");
					},
				});
			}
			case "ASSIGN_ARTICLE": {
				return newReadonlyModel({
					name: "ASSIGN_ARTICLE",
					action: () => {
						router.push("/assign-article");
					},
				});
			}
			case "SIGN_OUT": {
				return newReadonlyModel({
					name: "SIGN_OUT",
					action: async () => {
						await signOut.interact({
							type: "SIGN_OUT",
							input: { hardNavigate: true },
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
