import { ReadonlyModel } from "@mvc-react/mvc";

export interface FooterModelView {
	copyrightText: string;
}

export type FooterModel = ReadonlyModel<FooterModelView>;
