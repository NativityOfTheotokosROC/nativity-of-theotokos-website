import { useRouter } from "@/src/i18n/navigation";
import { ViewInteractionInterface } from "@mvc-react/stateful";
import {
	LanguageToggleButtonModelInteraction,
	LanguageToggleButtonModelView,
} from "../model/language-toggle-button";
import EventEmitter from "node:events";

export function languageToggleButtonVIInterface(
	localeRouter: ReturnType<typeof useRouter>,
	currentPathName: string,
	localeChangeEmitter: EventEmitter,
): ViewInteractionInterface<
	LanguageToggleButtonModelView,
	LanguageToggleButtonModelInteraction
> {
	return {
		produceModelView: async function (
			interaction: LanguageToggleButtonModelInteraction,
			currentModelView: LanguageToggleButtonModelView | null,
		): Promise<LanguageToggleButtonModelView> {
			if (!currentModelView)
				throw new Error("The model is uninitialized");
			const { displayedLanguage } = currentModelView;
			switch (interaction.type) {
				case "TOGGLE_LANGUAGE": {
					localeRouter.replace(
						currentPathName.slice(
							undefined,
							currentPathName.lastIndexOf("#") != -1
								? currentPathName.lastIndexOf("#")
								: undefined,
						),
						{ locale: displayedLanguage },
					);
					localeRouter.refresh();
					const newDisplayedLanguage =
						displayedLanguage == "en" ? "ru" : "en";
					const promise = new Promise<LanguageToggleButtonModelView>(
						resolve =>
							localeChangeEmitter.on("locale-change", () => {
								resolve({
									displayedLanguage: newDisplayedLanguage,
								});
							}),
					);
					return await promise;
				}
			}
		},
	};
}
