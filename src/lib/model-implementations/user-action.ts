import { newReadonlyModel } from "@mvc-react/mvc";
import { useRouter } from "next/navigation";
import { UserActionModel } from "../models/user-action";
import { signOut } from "../third-party/better-auth";
import { Role } from "../types/general";
import { getUserActionNames } from "../utilities/user-action";
import { PageLoadingBarModel } from "../models/page-loading-bar";

export function getUserActions(
	roles: Role[],
	router: ReturnType<typeof useRouter>,
	pageLoadingBar: PageLoadingBarModel,
) {
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
						await pageLoadingBar.interact({
							type: "SET_LOADING",
							input: { value: true },
						});
						await signOut().then(response => {
							if (response.data?.success) location.reload(); // TODO
							if (response.error)
								return pageLoadingBar.interact({
									type: "SET_LOADING",
									input: { value: false },
								});
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
