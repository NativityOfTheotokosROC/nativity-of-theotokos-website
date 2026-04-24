import { InteractiveModel, ModelInteraction } from "@mvc-react/mvc";
import { Language } from "../types/general";

export interface LanguageToggleModelView {
	alternateLanguage: Language;
}

export type LanguageToggleModelInteraction =
	ModelInteraction<"TOGGLE_LANGUAGE">;

export type LanguageToggleModel = InteractiveModel<
	LanguageToggleModelView,
	LanguageToggleModelInteraction
>;
