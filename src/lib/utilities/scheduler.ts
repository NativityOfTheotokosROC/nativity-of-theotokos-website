import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCloseWarning } from "../client-only/miscellaneous";
import {
	SpecificScheduleEventWithOptionalId,
	RecurringScheduleEventWithOptionalId,
	NewScheduleEvent,
} from "../models/schedule-event";
import {
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
	useInstantaneousScheduleItemSchema,
	useRecurringScheduleItemSchema,
} from "../validation/schedule-item";
import { getDateString } from "./date-time";
import { addDays } from "date-fns";
import { BLANK_TRANSLATION } from "./constants";

export function useScheduleEventForm({
	scheduleEvent,
	isNewEventValidCallback,
}: {
	scheduleEvent:
		| SpecificScheduleEventWithOptionalId
		| RecurringScheduleEventWithOptionalId;
	isNewEventValidCallback?: (newEvent: NewScheduleEvent | undefined) => void;
}) {
	const instantaneousScheduleItemSchema =
		useInstantaneousScheduleItemSchema();
	const recurringScheduleItemSchema = useRecurringScheduleItemSchema();
	const form = useForm({
		resolver: zodResolver(
			scheduleEvent.type === "specific"
				? instantaneousScheduleItemSchema
				: recurringScheduleItemSchema,
		),
		shouldUnregister: true,
		defaultValues: defaultForm(),
		mode: "onChange",
	});
	const {
		getValues,
		reset,
		formState: { isValid, isDirty },
	} = form;

	const currentForm = JSON.stringify(getValues());
	const [lastForm, setLastForm] = useState(currentForm);

	if (lastForm !== currentForm) setLastForm(currentForm);

	useEffect(() => {
		const { scheduleItem } = scheduleEvent;
		if (scheduleItem) {
			reset(
				"date" in scheduleItem
					? {
							...scheduleItem,
							date: getDateString(scheduleItem.date, true),
						}
					: scheduleItem,
			);
		} else {
			reset(defaultForm());
		}
	}, [reset, scheduleEvent]);

	useEffect(() => {
		if (isValid && isDirty && isNewEventValidCallback) {
			if (scheduleEvent.type === "recurring") {
				const newEvent = {
					type: "recurring",
					scheduleItem:
						recurringScheduleItemSchema.safeParse(getValues()).data,
				} as const;
				isNewEventValidCallback!(
					newEvent.scheduleItem
						? {
								...newEvent,
								scheduleItem: newEvent.scheduleItem,
							}
						: undefined,
				);
			} else {
				const newEvent = {
					type: "specific",
					scheduleItem:
						instantaneousScheduleItemSchema.safeParse(getValues())
							.data,
				} as const;
				isNewEventValidCallback(
					newEvent.scheduleItem
						? {
								...newEvent,
								scheduleItem: newEvent.scheduleItem,
							}
						: undefined,
				);
			}
		} else {
			isNewEventValidCallback?.(undefined);
		}
	}, [
		currentForm,
		getValues,
		instantaneousScheduleItemSchema,
		isDirty,
		isValid,
		recurringScheduleItemSchema,
		scheduleEvent.type,
		isNewEventValidCallback,
	]);

	useCloseWarning(() => isDirty);

	return form;
}
export function defaultForm():
	| NewInstantaneousScheduleItem
	| NewRecurringScheduleItem {
	return {
		title: BLANK_TRANSLATION,
		venue: BLANK_TRANSLATION,
		date: getDateString(addDays(new Date(), 1), true),
		recurringPattern: "",
		times: [{ designation: BLANK_TRANSLATION, time: "09:00" }],
	};
}
