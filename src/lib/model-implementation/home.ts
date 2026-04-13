import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { HomeModel, HomeModelInteraction, HomeModelView } from "../model/home";
import { getHomeSnapshot } from "../server-action/home";

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
	useQuery({
		queryKey: ["home"],
		queryFn: () => interact({ type: "REFRESH" }),
		staleTime: Infinity,
		gcTime: Infinity,
	});
	return { modelView, interact };
}
