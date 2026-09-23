import { Role } from "./user";

export const ALL_ACTION_NAMES = [
	"NOTIFICATIONS",
	"NEW_QUOTE",
	"SCHEDULER",
	"WRITE_ARTICLE",
	"REVIEW_ARTICLE",
	"ASSIGN_ARTICLE",
	"SIGN_OUT",
] as const;

export type ActionName = (typeof ALL_ACTION_NAMES)[number];

export function getUserActionNames(roles: Role[]) {
	const allUserActions = ALL_ACTION_NAMES;
	const specificActions = new Set<ActionName>();
	for (const role of roles) {
		switch (role) {
			case "admin": {
				return allUserActions;
			}
			case "staff": {
				break;
			}
			case "scheduler": {
				specificActions.add("SCHEDULER");
				break;
			}
			case "writer": {
				specificActions.add("WRITE_ARTICLE");
				break;
			}
			case "editor": {
				specificActions.add("REVIEW_ARTICLE");
				break;
			}
			case "quotes": {
				specificActions.add("NEW_QUOTE");
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
