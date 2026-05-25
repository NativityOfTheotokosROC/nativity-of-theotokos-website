import { ReadonlyModel } from "@mvc-react/mvc";
import { ActionName } from "./user-action";

export type UserActionsModelView = {
	actions: Set<ActionName>;
};

export type UserActionsModel = ReadonlyModel<UserActionsModelView>;
