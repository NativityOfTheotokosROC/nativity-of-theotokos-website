import {
	InputModelInteraction,
	InteractiveModel,
	ModelInteraction,
} from "@mvc-react/mvc";
import { Article, Image } from "../types/general";

type ArticleImage = Article["articleImage"];

export type ArticlePreviewModalModelView = {
	isOpen: boolean;
	title: string;
	body: string;
	authorName: string;
	dateCreated?: Date;
	image?: ArticleImage;
	snippet?: string;
};

export type ArticlePreviewModalModelInteraction =
	| ModelInteraction<"SUBMIT">
	| InputModelInteraction<
			"OPEN",
			{
				title: string;
				body: string;
				authorName: string;
				dateCreated?: Date;
				image?: ArticleImage;
				snippet?: string;
			}
	  >
	| ModelInteraction<"CLOSE">;

export type ArticlePreviewModalModel = InteractiveModel<
	ArticlePreviewModalModelView,
	ArticlePreviewModalModelInteraction
>;
