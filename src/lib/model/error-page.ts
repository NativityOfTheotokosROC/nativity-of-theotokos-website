import { ReadonlyModel } from "@mvc-react/mvc";

export interface ErrorPageModelView {
	message: string;
	resetFunction: () => void;
}

export type ErrorPageModel = ReadonlyModel<ErrorPageModelView>;
