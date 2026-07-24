import { Model } from "@mvc-react/mvc";
import { Language } from "../types/general";

export type NewArticleModelView = {
	language: Language;
};

export type NewArticleModel = Model<NewArticleModelView>;
