import { ReadonlyModel } from "@mvc-react/mvc";
import { ActionName } from "../utilities/user-action";

export type UserActionModelView = {
	name: ActionName;
	action: () => void;
};

export type UserActionModel = ReadonlyModel<UserActionModelView>;
