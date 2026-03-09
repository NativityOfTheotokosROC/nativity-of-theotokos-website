import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	LanguageToggleModelInteraction,
	LanguageToggleModelView,
} from "../model/language-toggle";
import EventEmitter from "node:events";
import { Language } from "../type/miscellaneous";
import { useState, useEffect } from "react";

export function languageToggleVIInterface(
	localeRouter: ReturnType<typeof useRouter>,
	currentPathName: string,
	localeChangeEmitter: EventEmitter,
): ViewInteractionInterface<
	LanguageToggleModelView,
	LanguageToggleModelInteraction
> {
	return {
		produceModelView: async function (
			interaction: LanguageToggleModelInteraction,
			currentModelView: LanguageToggleModelView | null,
		): Promise<LanguageToggleModelView> {
			if (!currentModelView)
				throw new Error("The model is uninitialized");
			const { alternateLanguage } = currentModelView;
			switch (interaction.type) {
				case "TOGGLE_LANGUAGE": {
					localeRouter.replace(
						currentPathName.slice(
							undefined,
							currentPathName.lastIndexOf("#") != -1
								? currentPathName.lastIndexOf("#")
								: undefined,
						),
						{ locale: alternateLanguage },
					);
					const newAlternateLanguage =
						alternateLanguage == "en" ? "ru" : "en";
					const { promise, resolve } =
						Promise.withResolvers<LanguageToggleModelView>();
					localeChangeEmitter.on("locale-change", () => {
						resolve({
							alternateLanguage: newAlternateLanguage,
						});
					});
					return await promise;
				}
			}
		},
	};
}

const useLanguageToggle = (
	locale: Language,
	router: ReturnType<typeof useRouter>,
) => {
	const alternateLanguage: Language = locale == "en" ? "ru" : "en";
	const currentPathName = usePathname();
	const [localeChangeEmitter] = useState(new EventEmitter());
	const languageToggle = useInitializedStatefulInteractiveModel(
		languageToggleVIInterface(router, currentPathName, localeChangeEmitter),
		{ alternateLanguage },
	);

	useEffect(() => {
		localeChangeEmitter.emit("locale-change");
	}, [locale, localeChangeEmitter]);

	return languageToggle;
};

export { useLanguageToggle };
