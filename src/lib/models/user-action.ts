import { ReadonlyModel } from "@mvc-react/mvc";

export type ActionName =
	| "NEW_QUOTE"
	| "WRITE_ARTICLE"
	| "REVIEW_ARTICLE"
	| "SIGN_OUT";

export type UserActionModelView = {
	name: ActionName;
	action: () => Awaited<void>;
};

export type UserActionModel = ReadonlyModel<UserActionModelView>;
