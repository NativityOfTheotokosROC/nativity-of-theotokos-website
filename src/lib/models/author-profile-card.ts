import { Model } from "@mvc-react/mvc";
import { Image } from "../utilities/types";

export type AuthorProfileCardModelView = {
	name: string;
	description: string;
	profilePicture?: Image;
	contactEmail?: string;
};

export type AuthorProfileCardModel = Model<AuthorProfileCardModelView>;
