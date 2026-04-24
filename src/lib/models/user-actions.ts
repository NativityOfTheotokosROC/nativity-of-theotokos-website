import { ReadonlyModel } from "@mvc-react/mvc";
import { ActionName } from "./user-action";

export interface UserActionsModelView {
	actions: Set<ActionName>;
}

export type UserActionsModel = ReadonlyModel<UserActionsModelView>;
