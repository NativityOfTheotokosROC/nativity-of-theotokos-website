import { ActionName } from "../models/user-action";
import { Role } from "../types/general";

function getAllActionNames() {
	const actionNames = [
		"NOTIFICATIONS",
		"NEW_QUOTE",
		"WRITE_ARTICLE",
		"REVIEW_ARTICLE",
		"ASSIGN_ARTICLE",
		"SIGN_OUT",
	] as const satisfies ActionName[];
	type MissingActionName = Exclude<ActionName, (typeof actionNames)[number]>;
	type UniversalActionNames = MissingActionName extends never
		? typeof actionNames
		: never;
	return new Set(actionNames satisfies UniversalActionNames);
}

export function getUserActionNames(roles: Role[]) {
	const allUserActions = getAllActionNames();
	let specificActions = new Set<ActionName>();
	for (const role of roles) {
		switch (role) {
			case "admin": {
				return allUserActions;
			}
			case "staff": {
				break;
			}
			case "writer": {
				specificActions = new Set([
					...specificActions,
					"WRITE_ARTICLE",
				]);
				break;
			}
			case "editor": {
				specificActions = new Set([
					...specificActions,
					"REVIEW_ARTICLE",
				]);
				break;
			}
			case "quotes": {
				specificActions = new Set([...specificActions, "NEW_QUOTE"]);
				break;
			}
			case "user": {
				break;
			}
			default: {
				throw new Error(`Invalid role: ${role satisfies never}`);
			}
		}
	}
	return new Set([
		...specificActions,
		"NOTIFICATIONS",
		"SIGN_OUT",
	]) satisfies Set<ActionName>;
}
