import { ActionName } from "../model/user-action";
import { Role } from "../type/miscellaneous";

function getAllActionNames() {
	const actionNames = [
		"NEW_ARTICLE",
		"NEW_QUOTE",
		"SIGN_OUT",
	] as const satisfies ActionName[];
	type MissingActionName = Exclude<ActionName, (typeof actionNames)[number]>;
	type UniversalActionNames = MissingActionName extends never
		? typeof actionNames
		: never;
	return new Set(actionNames satisfies UniversalActionNames);
}

export function getUserActions(roles: Role[]) {
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
				specificActions = new Set([...specificActions, "NEW_ARTICLE"]);
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
	return new Set([...specificActions, "SIGN_OUT"]) satisfies Set<ActionName>;
}
