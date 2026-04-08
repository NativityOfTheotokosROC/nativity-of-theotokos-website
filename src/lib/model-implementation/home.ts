import { HomeModel, HomeModelInteraction, HomeModelView } from "../model/home";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { getHomeSnapshot } from "../server-action/home";
import { useEffect } from "react";
import { useLocale } from "next-intl";

export function useHome(): HomeModel {
	const language = useLocale();
	const { modelView, interact } = useNewStatefulInteractiveModel<
		HomeModelView,
		HomeModelInteraction
	>({
		async produceModelView(interaction) {
			switch (interaction.type) {
				case "REFRESH": {
					const {
						dailyReadings,
						dailyQuote,
						scheduleItems,
						newsArticles,
						dailyGalleryImages,
					} = await getHomeSnapshot(4, 4, 7, language);
					return {
						dailyReadings,
						dailyQuote,
						scheduleItems,
						newsArticles,
						dailyGalleryImages,
					};
				}
			}
		},
	});

	useEffect(() => {
		if (!modelView) {
			interact({ type: "REFRESH" });
		}
	}, [modelView, interact]);
	return { modelView, interact };
}
