import { ReadonlyModel } from "@mvc-react/mvc";

export interface PageNavigationButtonModelView {
	endpoint: `/${string}`;
	browserNavigation?: boolean;
}

export type PageNavigationButtonModel =
	ReadonlyModel<PageNavigationButtonModelView>;
