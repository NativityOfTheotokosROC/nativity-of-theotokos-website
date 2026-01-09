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
					const snapshot = await getHomeSnapshot();
					return {
						dailyReadings: snapshot.dailyReadings,
						dailyQuote: snapshot.dailyQuote,
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
