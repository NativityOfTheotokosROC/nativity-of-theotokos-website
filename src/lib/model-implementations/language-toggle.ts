import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	LanguageToggleModelInteraction,
	LanguageToggleModelView,
} from "../models/language-toggle";
import EventEmitter from "node:events";
import { Language } from "../utilities/types";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { URLSearchParams } from "node:url";

export function languageToggleVIInterface(
	localeRouter: ReturnType<typeof useRouter>,
	currentPathName: string,
	localeChangeEmitter: EventEmitter,
	searchParams?: URLSearchParams,
): ViewInteractionInterface<
	LanguageToggleModelView,
	LanguageToggleModelInteraction
> {
	return {
		async produceModelView(interaction, currentModelView) {
			if (!currentModelView)
				throw new Error("The model is uninitialized");
			const { alternateLanguage } = currentModelView;
			switch (interaction.type) {
				case "TOGGLE_LANGUAGE": {
					const currentLanguage =
						alternateLanguage === "en" ? "ru" : "en";

					const { promise, resolve } =
						Promise.withResolvers<LanguageToggleModelView>();
					localeChangeEmitter.once("locale-change", () => {
						resolve({
							alternateLanguage: currentLanguage,
						});
					});

					// let newPathName = ["/", "#", "?"]
					// 	.map(delimiter =>
					// 		currentPathName.replace(
					// 			`/${currentLanguage}${delimiter}`,
					// 			`/${alternateLanguage}${delimiter}`,
					// 		),
					// 	)
					// 	.find(
					// 		candidate => !currentPathName.includes(candidate),
					// 	);
					// if (
					// 	!newPathName &&
					// 	currentPathName.endsWith(`/${currentLanguage}`)
					// )
					// 	newPathName = currentPathName.replace(
					// 		new RegExp(`\\/${currentLanguage}$`),
					// 		`/${alternateLanguage}`,
					// 	);
					// if (!newPathName)
					const newFullPath = `/${alternateLanguage}${currentPathName}${searchParams ? `?${searchParams.toString()}` : ""}`;

					// localeRouter.replace( //TODO: Revisit once caching situation is figured out
					// 	currentPathName.slice(
					// 		undefined,
					// 		currentPathName.lastIndexOf("#") != -1
					// 			? currentPathName.lastIndexOf("#")
					// 			: undefined,
					// 	),
					// 	{ locale: alternateLanguage, },
					// );
					// localeRouter.refresh();
					location.replace(newFullPath);
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
	const alternateLanguage: Language = locale === "en" ? "ru" : "en";
	const currentPathName = usePathname();
	// const searchParams = useSearchParams();
	const [localeChangeEmitter] = useState(new EventEmitter());
	const languageToggle = useInitializedStatefulInteractiveModel(
		languageToggleVIInterface(
			router,
			currentPathName,
			localeChangeEmitter,
			// searchParams,
		),
		{ alternateLanguage },
	);

	useEffect(() => {
		localeChangeEmitter.emit("locale-change");
	}, [locale, localeChangeEmitter]);

	return languageToggle;
};

export { useLanguageToggle };
