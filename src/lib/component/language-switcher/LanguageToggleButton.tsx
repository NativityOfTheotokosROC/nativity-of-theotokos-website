"use client";

import EnglishIcon from "@/public/ui/english.svg";
import RussianIcon from "@/public/ui/russian.svg";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { JSX } from "react";
import { Language } from "../../type/miscellaneous";
import { LanguageToggleButtonModel } from "../../model/language-toggle-button";
import "./language-toggle-button.css";

const languageToRenderedMap = new Map<Language, JSX.Element>([
	[
		"en",
		<span className="flex gap-2 items-center" key="en">
			<EnglishIcon className="size-5" />
			<span>English</span>
		</span>,
	],
	[
		"ru",
		<span className="flex gap-2 items-center" key="ru">
			<RussianIcon className="size-5" />
			<span>Русский</span>
		</span>,
	],
]);

const LanguageToggleButton = function ({ model }) {
	const { modelView, interact } = model;
	const { displayedLanguage } = modelView;

	return (
		<button
			className="language-toggle-button sticky bottom-[-1] right-1/20 float-end self-end z-11 p-3 w-[5em] rounded-t-lg min-w-fit bg-gray-900 hover:underline active:underline text-white text-sm md:text-base border border-white/20"
			onClick={() => interact({ type: "TOGGLE_LANGUAGE" })}
		>
			{languageToRenderedMap.get(displayedLanguage)}
		</button>
	);
} satisfies ModeledVoidComponent<InitializedModel<LanguageToggleButtonModel>>;

export default LanguageToggleButton;
