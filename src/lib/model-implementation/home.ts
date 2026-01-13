import { HomeModel, HomeModelInteraction, HomeModelView } from "../model/home";
import { useNewStatefulInteractiveModel } from "@mvc-react/stateful";
import { getHomeSnapshot } from "../server-actions/home";
import { useEffect } from "react";

export function useHome(): HomeModel {
	const { modelView, interact } = useNewStatefulInteractiveModel<
		HomeModelView,
		HomeModelInteraction
	>({
		async produceModelView(interaction) {
			switch (interaction.type) {
				case "REFRESH": {
					const { dailyReadings, dailyQuote, scheduleItems } =
						await getHomeSnapshot();
					return {
						dailyReadings,
						dailyQuote,
						scheduleItems,
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
