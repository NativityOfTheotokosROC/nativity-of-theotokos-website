import {
	ViewInteractionInterface,
	useNewStatefulInteractiveModel,
} from "@mvc-react/stateful";
import { UninitializedModelError } from "../utilities/errors";
import {
	ScheduleQuoteModalModelView,
	ScheduleQuoteModalModelInteraction,
	ScheduleQuoteModalModel,
} from "../models/schedule-quote-modal";

export function scheduleQuoteModalVIInterface(
	scheduleQuoteCallback: (
		quoteId: number,
		date: string,
		oldDate?: string,
	) => Promise<void>,
) {
	return {
		async produceModelView(interaction, currentModelView) {
			switch (interaction.type) {
				case "OPEN": {
					const { quote } = interaction.input;
					return {
						isOpen: true,
						quote,
					};
				}
				case "CLOSE": {
					if (!currentModelView) throw new UninitializedModelError();
					return { ...currentModelView, isOpen: false };
				}
				case "SCHEDULE_QUOTE": {
					if (!currentModelView) throw new UninitializedModelError();
					const { quoteId, date, oldDate } = interaction.input;
					await scheduleQuoteCallback(quoteId, date, oldDate);
					return { ...currentModelView, isOpen: false };
				}
			}
		},
	} satisfies ViewInteractionInterface<
		ScheduleQuoteModalModelView,
		ScheduleQuoteModalModelInteraction
	>;
}

export function useScheduleQuoteModal(
	scheduleQuoteCallback: (
		quoteId: number,
		date: string,
		oldDate?: string,
	) => Promise<void>,
) {
	const model = useNewStatefulInteractiveModel(
		scheduleQuoteModalVIInterface(scheduleQuoteCallback),
	);
	return model satisfies ScheduleQuoteModalModel;
}
