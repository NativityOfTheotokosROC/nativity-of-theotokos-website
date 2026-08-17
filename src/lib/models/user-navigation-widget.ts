import { ReadonlyModel } from "@mvc-react/mvc";
import { Image, Role, User } from "../types/general";
import { UserActionModel } from "./user-action";

export type NavigationUserDetails = Pick<User, "name"> & {
	avatar: Pick<Image, "source" | "about">;
	roles: Role[];
};

export type NavigationUser = Omit<NavigationUserDetails, "roles">;

export type UserNavigationWidgetVariant = "full" | "no_avatar" | "abbreviated";
export type UserNavigationWidgetStyle = "dropdown" | "accordion";
export type SignInNavlinkVariant = "simple_link" | "block";

export type UserNavigationWidgetModelView = {
	userActions: UserActionModel[];
	variant: UserNavigationWidgetVariant;
	style: UserNavigationWidgetStyle;
	signIn?: {
		navlinkVariant: SignInNavlinkVariant;
		action?: () => void;
	};
};

export type UserNavigationWidgetModel =
	ReadonlyModel<UserNavigationWidgetModelView>;
