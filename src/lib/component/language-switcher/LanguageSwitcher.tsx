"use client";

import { useRouter } from "@/src/i18n/navigation";
import { ModeledVoidComponent } from "@mvc-react/components";
import { useLanguageToggle } from "../../model-implementation/language-toggle";
import { LanguageSwitcherModel } from "../../model/language-switcher";
import { usePageLoadingBarRouter } from "../../utility/page-loading-bar";
import LanguageToggleButton from "./LanguageToggle";

const LanguageSwitcher = function ({ model }) {
	const { locale } = model.modelView;

	const router = usePageLoadingBarRouter(useRouter);
	const languageToggle = useLanguageToggle(locale, router);

	return <LanguageToggleButton model={languageToggle} />;
} satisfies ModeledVoidComponent<LanguageSwitcherModel>;

export default LanguageSwitcher;
