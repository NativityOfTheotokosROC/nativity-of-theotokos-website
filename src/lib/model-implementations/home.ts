import { useLocale } from "next-intl";
import { HomeModel, HomeModelInteraction } from "../models/home";
import { getHomeSnapshot } from "../server-actions/home";
import { useQuery } from "@tanstack/react-query";

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
		if (interaction.type === "REFRESH") refetch();
	};

	if (isSuccess) {
		const {
			dailyGalleryImages,
			dailyQuote,
			dailyReadings,
			articles,
			scheduleItems,
		} = data;
		return {
			modelView: {
				dailyGalleryImages,
				dailyQuote,
				dailyReadings,
				articles,
				scheduleItems,
			},
			interact,
		};
	}
	return { modelView: null, interact };
}
