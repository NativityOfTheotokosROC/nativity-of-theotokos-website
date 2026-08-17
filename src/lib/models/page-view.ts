import { Model } from "@mvc-react/mvc";

export type PageViewModelView = {
	title?: string;
	topBarColor?: string;
	isTopBarDecorative?: boolean;
};

export type PageViewModel = Model<PageViewModelView>;
