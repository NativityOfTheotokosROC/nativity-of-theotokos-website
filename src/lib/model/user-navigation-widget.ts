import { ModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Image, Role, User } from "../type/miscellaneous";

export type NavigationUserDetails = Pick<User, "name"> & {
	avatar: Pick<Image, "source" | "about">;
	roles: Role[];
};

export type UserNavigationWidgetType = "sidebar" | "navbar";

export interface UserNavigationWidgetModelView {
	userDetails: NavigationUserDetails | null;
	type: UserNavigationWidgetType;
}

export type UserNavigationWidgetModelInteraction = ModelInteraction<"SIGN_OUT">;

export type UserNavigationWidgetModel = InteractiveModel<
	UserNavigationWidgetModelView,
	UserNavigationWidgetModelInteraction
>;
