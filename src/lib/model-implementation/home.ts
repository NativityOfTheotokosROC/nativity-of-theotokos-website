import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { HomeModel, HomeModelInteraction } from "../model/home";
import { getHomeSnapshot } from "../server-action/home";

export function useHome(): HomeModel {
	const language = useLocale();
	const { data, isSuccess, refetch } = useQuery({
		queryKey: ["home"],
		queryFn: () => getHomeSnapshot(4, 4, 7, language),
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	});
	const interact = async (interaction: HomeModelInteraction) => {
		if (interaction.type == "REFRESH") refetch();
	};

	if (isSuccess) {
		const {
			dailyGalleryImages,
			dailyQuote,
			dailyReadings,
			newsArticles,
			scheduleItems,
		} = data;
		return {
			modelView: {
				dailyGalleryImages,
				dailyQuote,
				dailyReadings,
				newsArticles,
				scheduleItems,
			},
			interact,
		};
	}
	return { modelView: null, interact };
}
