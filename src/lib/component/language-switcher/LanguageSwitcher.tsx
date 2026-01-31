"use client";

import EnglishIcon from "@/public/english.svg";
import RussianIcon from "@/public/russian.svg";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { JSX } from "react";
import { Language, LanguageSwitcherModel } from "../../model/language-switcher";
import "./language-switcher.css";
import { Link, usePathname } from "@/src/i18n/navigation";

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

const LanguageSwitcher = function ({ model }) {
	const { modelView } = model;
	const { displayedLanguage } = modelView;
	const pathName = usePathname();

	return (
		<div className="language-switcher sticky bottom-[-1] right-1/20 float-end z-20 p-3 w-[5em] rounded-t-lg min-w-fit bg-gray-900 hover:underline text-white text-sm md:text-base border border-white/20">
			{/* TODO: Something more elegant in the future maybe */}
			<Link
				href={pathName.slice(
					undefined,
					pathName.lastIndexOf("#") != -1
						? pathName.lastIndexOf("#")
						: undefined,
				)}
				locale={displayedLanguage}
			>
				{languageToRenderedMap.get(displayedLanguage)}
			</Link>
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<LanguageSwitcherModel>>;

export default LanguageSwitcher;
