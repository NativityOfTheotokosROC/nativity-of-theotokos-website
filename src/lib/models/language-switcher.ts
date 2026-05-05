import { ReadonlyModel } from "@mvc-react/mvc";
import { Language } from "../types/general";

export type LanguageSwitcherModelView = {
	locale: Language;
};

export type LanguageSwitcherModel = ReadonlyModel<LanguageSwitcherModelView>;
