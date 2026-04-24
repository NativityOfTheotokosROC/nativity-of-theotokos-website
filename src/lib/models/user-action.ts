import { ReadonlyModel } from "@mvc-react/mvc";

export type ActionName = "NEW_QUOTE" | "NEW_ARTICLE" | "SIGN_OUT";

export interface UserActionModelView {
	name: ActionName;
	action: () => Awaited<void>;
}

export type UserActionModel = ReadonlyModel<UserActionModelView>;
