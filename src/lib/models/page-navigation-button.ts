import { ReadonlyModel } from "@mvc-react/mvc";

export type PageNavigationButtonModelView = {
	endpoint: `/${string}`;
	browserNavigation?: boolean;
};

export type PageNavigationButtonModel =
	ReadonlyModel<PageNavigationButtonModelView>;
