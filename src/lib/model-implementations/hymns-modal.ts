import { ViewInteractionInterface } from "@mvc-react/stateful";
import {
	HymnsModalModelInteraction,
	HymnsModalModelView,
} from "../models/hymns-modal";

export function hymnsModalVIInterface(): ViewInteractionInterface<
	HymnsModalModelView,
	HymnsModalModelInteraction
> {
	return {
		produceModelView: async function (
			interaction: HymnsModalModelInteraction,
			currentModelView: HymnsModalModelView | null,
		): Promise<HymnsModalModelView> {
			switch (interaction.type) {
				case "OPEN":
					return {
						hymns: interaction.input.hymns,
						isOpen: true,
					};
				case "CLOSE":
					if (!currentModelView)
						throw new Error("Hymns modal is uninitialized");
					return {
						...currentModelView,
						isOpen: false,
					};
			}
		},
	};
}
