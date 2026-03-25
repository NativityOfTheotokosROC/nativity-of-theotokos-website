import { newReadonlyModel } from "@mvc-react/mvc";
import { useRouter } from "next/navigation";
import { UserActionModel } from "../model/user-action";
import { signOut } from "../third-party/better-auth";
import { Role } from "../type/miscellaneous";
import { getUserActionNames } from "../utility/user-actions";

export function getUserActions(
	roles: Role[],
	router: ReturnType<typeof useRouter>,
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
						await signOut();
						location.reload(); // TODO
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
