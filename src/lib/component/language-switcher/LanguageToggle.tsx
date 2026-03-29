"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { JSX } from "react";
import { Language } from "../../type/general";
import { LanguageToggleModel } from "../../model/language-toggle";
import "./language-toggle.css";
import EnglishIcon from "@/public/assets/english.svg";
import RussianIcon from "@/public/assets/russian.svg";

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
	const { alternateLanguage } = modelView;

	return (
		<button
			className={
				"language-toggle-button sticky bottom-[-1] right-1/20 float-end self-end z-10 p-3 w-[5em] rounded-t-lg min-w-fit bg-gray-900 hover:underline active:underline text-white text-sm md:text-base border border-white/20"
			}
			onClick={() => interact({ type: "TOGGLE_LANGUAGE" })}
		>
			{languageToRenderedMap.get(alternateLanguage)}
		</button>
	);
} satisfies ModeledVoidComponent<InitializedModel<LanguageToggleModel>>;

export default LanguageToggleButton;
