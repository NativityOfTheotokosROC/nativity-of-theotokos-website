import { ReadonlyModel } from "@mvc-react/mvc";

export interface ShareButtonModelView {
	title: string;
	url: string;
}

export type ShareButtonModel = ReadonlyModel<ShareButtonModelView>;
