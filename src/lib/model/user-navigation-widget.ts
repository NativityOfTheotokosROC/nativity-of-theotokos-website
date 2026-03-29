import { ReadonlyModel } from "@mvc-react/mvc";
import { Image, Role, User } from "../type/general";
import { UserActionModel } from "./user-action";

export type NavigationUserDetails = Pick<User, "name"> & {
	avatar: Pick<Image, "source" | "about">;
	roles: Role[];
};

export type NavigationUser = Omit<NavigationUserDetails, "roles">;

export type UserNavigationWidgetVariant = "full" | "no_avatar" | "abbreviated";
export type UserNavigationWidgetStyle = "dropdown" | "accordion";

export interface UserNavigationWidgetModelView {
	userDetails: {
		user: NavigationUser;
		userActions: UserActionModel[];
	} | null;
	variant: UserNavigationWidgetVariant;
	style: UserNavigationWidgetStyle;
}

export type UserNavigationWidgetModel =
	ReadonlyModel<UserNavigationWidgetModelView>;
