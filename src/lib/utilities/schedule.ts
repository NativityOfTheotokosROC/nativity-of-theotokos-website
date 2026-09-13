import { Cron } from "croner";
import { getDateString, getNativeTimeZone } from "./date-time";
import {
	InstantaneousScheduleItem,
	MakeOptional,
	RecurringScheduleItem,
	RecurringScheduleItemInstance,
	Text,
} from "./types";

type RecurringScheduleItemWithOptionalId<T extends Text = string> =
	MakeOptional<RecurringScheduleItem<T>, "id">;

export function validateRecurringPattern(
	pattern: string,
	options?: Partial<{ useLocalTimezone: boolean }>,
) {
	try {
		const cron = new Cron(
			pattern,
			options?.useLocalTimezone
				? { timezone: getNativeTimeZone() }
				: undefined,
		);
		if (
			!cron.getPattern()?.startsWith("0 0 0") ||
			cron.getPattern()?.endsWith("* * *")
		)
			return null;
		return cron;
	} catch {
		return null;
	}
}

export function getNextRecurringScheduleItemDate(
	pattern: string,
	referenceDate?: Date | string,
) {
	const cron = validateRecurringPattern(pattern, { useLocalTimezone: true });
	if (!cron) throw new Error("Invalid recurring pattern");
	return cron.nextRun(referenceDate);
}

export function getNextRecurringScheduleItemDates(
	pattern: string,
	instances: number,
	referenceDate?: Date | string,
) {
	const cron = validateRecurringPattern(pattern, { useLocalTimezone: true });
	if (!cron) throw new Error("Invalid recurring pattern");
	return cron.nextRuns(instances, referenceDate);
}

export function getNextRecurringScheduleItemInstances<T extends Text = string>(
	{
		id,
		recurringPattern,
		title,
		venue,
		times,
	}: RecurringScheduleItemWithOptionalId<T>,
	instances: number,
	referenceDate?: Date,
) {
	return getNextRecurringScheduleItemDates(
		recurringPattern,
		instances,
		referenceDate,
	).map(
		date =>
			({
				recurringItemId: id,
				title,
				venue,
				date,
				times,
			}) satisfies MakeOptional<
				RecurringScheduleItemInstance<T>,
				"recurringItemId"
			>,
	);
}

export function generateSchedule<
	I extends InstantaneousScheduleItem<T>,
	R extends RecurringScheduleItemWithOptionalId,
	T extends Text = string,
>(
	instantaneousScheduleItems: I[],
	recurringScheduleItems: R[],
	maxItems: number,
	referenceDate?: Date,
) {
	const resolvedReferenceDate = new Date(
		getDateString(referenceDate ?? new Date(), true),
	);
	const scheduleItems = [
		...instantaneousScheduleItems.filter(
			scheduleItem =>
				!scheduleItem.isRemoved &&
				scheduleItem.date.getTime() >= resolvedReferenceDate.getTime(),
		),
		...recurringScheduleItems
			.filter(scheduleItem => scheduleItem.isDisabled)
			.flatMap(activeItem =>
				getNextRecurringScheduleItemInstances(
					activeItem,
					maxItems,
					resolvedReferenceDate,
				),
			),
	];
	return scheduleItems
		.toSorted((a, b) => a.date.getTime() - b.date.getTime())
		.toSpliced(0, maxItems);
}
