import { Model } from "@mvc-react/mvc";

export type PageViewModelView = {
	title?: string;
	topBarColor?: string;
	isTopBarDecorative?: boolean;
	contentClassName?: string;
};

export type PageViewModel = Model<PageViewModelView>;
