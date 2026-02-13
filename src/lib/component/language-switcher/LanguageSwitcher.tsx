"use client";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useInitializedStatefulInteractiveModel } from "@mvc-react/stateful";
import { languageToggleButtonVIInterface } from "../../model-implementation/language-toggle-button";
import { LanguageSwitcherModel } from "../../model/language-switcher";
import { Language } from "../../type/miscellaneous";
import { useLoadingBarRouter } from "../loading-bar/navigation";
import LanguageToggleButton from "./LanguageToggleButton";
import { ModeledVoidComponent } from "@mvc-react/components";
import EventEmitter from "node:events";
import { useEffect, useState } from "react";

const LanguageSwitcher = function ({ model }) {
	const { locale } = model.modelView;
	const displayedLanguage: Language = locale == "en" ? "ru" : "en";
	const currentPathName = usePathname();
	const router = useLoadingBarRouter(useRouter);
	const [localeChangeEmitter] = useState(new EventEmitter());
	const languageToggleButton = useInitializedStatefulInteractiveModel(
		languageToggleButtonVIInterface(
			router,
			currentPathName,
			localeChangeEmitter,
		),
		{ displayedLanguage: displayedLanguage },
	);

	useEffect(() => {
		localeChangeEmitter.emit("locale-change");
	}, [locale, localeChangeEmitter]);

	return <LanguageToggleButton model={languageToggleButton} />;
} satisfies ModeledVoidComponent<LanguageSwitcherModel>;

export default LanguageSwitcher;
