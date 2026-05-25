"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { useLanguageToggle } from "../../model-implementations/language-toggle";
import { LanguageSwitcherModel } from "../../models/language-switcher";
import { usePageLoadingBarRouter } from "../../utilities/page-loading-bar";
import LanguageToggleButton from "./LanguageToggle";

const LanguageSwitcher = function ({ model }) {
	const { locale } = model.modelView;

	const router = usePageLoadingBarRouter();
	const languageToggle = useLanguageToggle(locale, router);

	return <LanguageToggleButton model={languageToggle} />;
} satisfies ModeledVoidComponent<LanguageSwitcherModel>;

export default LanguageSwitcher;
