import { ReadonlyModel } from "@mvc-react/mvc";

export interface LanguageSwitcherModelView {
	locale: string;
}

export type LanguageSwitcherModel = ReadonlyModel<LanguageSwitcherModelView>;
