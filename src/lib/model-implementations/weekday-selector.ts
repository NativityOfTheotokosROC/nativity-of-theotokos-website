import {
	useInitializedStatefulInteractiveModel,
	ViewInteractionInterface,
} from "@mvc-react/stateful";
import {
	WeekdaySelectorModelView,
	WeekdaySelectorModelInteraction,
} from "../models/weekday-selector";
import { Day } from "../utilities/weekday-selector";
import { UninitializedModelError } from "../utilities/errors";
import { Options } from "../utilities/types";

type VIInterfaceOptions = Options<{
	updateCallback: (
		selectedDays: WeekdaySelectorModelView["selectedDays"],
	) => void;
}>;

export function weekdaySelectorVIInterface(params?: VIInterfaceOptions) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "TOGGLE_DAY": {
					if (!currentModelView) throw new UninitializedModelError();
					const { day } = interaction.input;
					const { selectedDays } = currentModelView;
					const updatedSelectedDays = selectedDays.has(day)
						? selectedDays.difference(new Set([day]))
						: selectedDays.union(new Set([day]));
					params?.options?.updateCallback?.(updatedSelectedDays);
					return {
						...currentModelView,
						selectedDays: updatedSelectedDays,
					};
				}
			}
		},
	} satisfies ViewInteractionInterface<
		WeekdaySelectorModelView,
		WeekdaySelectorModelInteraction
	>;
}

export function useWeekdaySelector({
	selectedDays,
	options,
}: { selectedDays?: Set<Day> } & VIInterfaceOptions) {
	return useInitializedStatefulInteractiveModel(
		weekdaySelectorVIInterface({ options }),
		{ selectedDays: selectedDays ?? new Set<Day>() },
	);
}
