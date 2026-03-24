import { ReadonlyModel } from "@mvc-react/mvc";
import { Image, Role, User } from "../type/miscellaneous";

export type NavigationUserDetails = Pick<User, "name"> & {
	avatar: Pick<Image, "source" | "about">;
	roles: Role[];
};

export type UserNavigationWidgetVariant = "full" | "no_avatar" | "abbreviated";
export type UserNavigationWidgetStyle = "dropdown" | "accordion";

export interface UserNavigationWidgetModelView {
	userDetails: NavigationUserDetails | null;
	variant: UserNavigationWidgetVariant;
	style: UserNavigationWidgetStyle;
}

export type UserNavigationWidgetModel =
	ReadonlyModel<UserNavigationWidgetModelView>;
