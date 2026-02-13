import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { Language } from "../type/miscellaneous";

export interface LanguageToggleButtonModelView {
	displayedLanguage: Language;
}

export type LanguageToggleButtonModelInteraction =
	ModelInteraction<"TOGGLE_LANGUAGE">;

export type LanguageToggleButtonModel = InteractiveModel<
	LanguageToggleButtonModelView,
	LanguageToggleButtonModelInteraction
>;
