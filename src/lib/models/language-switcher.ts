import { ReadonlyModel } from "@mvc-react/mvc";
import { Language } from "../utilities/types";

export type LanguageSwitcherModelView = {
	locale: Language;
};

export type LanguageSwitcherModel = ReadonlyModel<LanguageSwitcherModelView>;
