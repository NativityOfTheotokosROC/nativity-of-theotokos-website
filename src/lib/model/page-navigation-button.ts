import { ReadonlyModel } from "@mvc-react/mvc";
import { ReactNode } from "react";

export interface PageNavigationButtonModelView {
	endpoint: `/${string}`;
	buttonContent: ReactNode;
}

export type PageNavigationButtonModel =
	ReadonlyModel<PageNavigationButtonModelView>;
