import { ModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Image, Role, User } from "../type/miscellaneous";

export type NavigationUserDetails = Pick<User, "name"> & {
	avatar: Pick<Image, "source" | "about">;
	roles: Role[];
};

export type UserNavigationType = "sidebar" | "navbar";

export interface UserNavigationModelView {
	userDetails: NavigationUserDetails;
	type: UserNavigationType;
}

export type UserNavigationModelInteraction = ModelInteraction<"SIGN_OUT">;

export type UserNavigationModel = InteractiveModel<
	UserNavigationModelView,
	UserNavigationModelInteraction
>;
