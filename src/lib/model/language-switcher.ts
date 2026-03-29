import { ReadonlyModel } from "@mvc-react/mvc";
import { Language } from "../type/general";

export interface LanguageSwitcherModelView {
	locale: Language;
}

export type LanguageSwitcherModel = ReadonlyModel<LanguageSwitcherModelView>;
