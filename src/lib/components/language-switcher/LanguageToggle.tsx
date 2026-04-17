"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { JSX } from "react";
import { Language } from "../../types/general";
import { LanguageToggleModel } from "../../models/language-toggle";
import "./language-toggle.css";
import EnglishIcon from "@/public/assets/english.svg";
import RussianIcon from "@/public/assets/russian.svg";

const languageToRenderedMap = new Map<Language, JSX.Element>([
	[
		"en",
		<span className="flex items-center gap-2" key="en">
			<EnglishIcon className="size-5" />
			<span>English</span>
		</span>,
	],
	[
		"ru",
		<span className="flex items-center gap-2" key="ru">
			<RussianIcon className="size-5" />
			<span>Русский</span>
		</span>,
	],
]);

const LanguageToggleButton = function ({ model }) {
	const { modelView, interact } = model;
	const { alternateLanguage } = modelView;

	return (
		<button
			className={
				"language-toggle-button sticky right-1/20 bottom-[-1] z-10 float-end w-[5em] min-w-fit self-end rounded-t-lg border border-white/20 bg-gray-900 p-3 text-sm text-white hover:underline active:underline md:text-base"
			}
			onClick={() => interact({ type: "TOGGLE_LANGUAGE" })}
		>
			{languageToRenderedMap.get(alternateLanguage)}
		</button>
	);
} satisfies ModeledVoidComponent<InitializedModel<LanguageToggleModel>>;

export default LanguageToggleButton;
