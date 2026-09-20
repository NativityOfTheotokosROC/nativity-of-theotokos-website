import { Cron } from "croner";
import { getDateString, getNativeTimeZone } from "./date-time";
import {
	InstantaneousScheduleItem,
	Language,
	MakeOptional,
	RecurringScheduleItem,
	RecurringScheduleItemInstance,
	ScheduleItem,
	Text,
	Translation,
} from "./types";
import { pickTranslation } from "./miscellaneous";
import {
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
} from "../validation/schedule-item";

export type BaseScheduleEvent<
	T extends string,
	I extends ScheduleItem<U>,
	U extends Text = string,
> = { type: T; scheduleItem: I };

export type ScheduleEvent<T extends Text = string> =
	| BaseScheduleEvent<"specific", InstantaneousScheduleItem<T>, T>
	| BaseScheduleEvent<"recurring", RecurringScheduleItem<T>, T>;
export type UniversalScheduleEvent<T extends Text = string> =
	| ScheduleEvent<T>
	| BaseScheduleEvent<
			"recurringInstance",
			RecurringScheduleItemInstance<T>,
			T
	  >;
export type InstantaneousScheduleItemWithOptionalId<T extends Text = string> =
	MakeOptional<InstantaneousScheduleItem<T>, "id">;
export type RecurringScheduleItemWithOptionalId<T extends Text = string> =
	MakeOptional<RecurringScheduleItem<T>, "id">;
export type RecurringScheduleItemInstanceWithOptionalId<
	T extends Text = string,
> = MakeOptional<RecurringScheduleItemInstance<T>, "recurringItemId">;

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
		isDisabled,
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
				isRemoved: isDisabled,
			}) satisfies MakeOptional<
				RecurringScheduleItemInstance<T>,
				"recurringItemId"
			>,
	);
}

export function generateSchedule<T extends Text = string>(
	instantaneousScheduleItems: InstantaneousScheduleItemWithOptionalId<T>[],
	recurringScheduleItems: RecurringScheduleItemWithOptionalId<T>[],
	maxItems: number,
	referenceDate?: Date,
) {
	const resolvedReferenceDate = new Date(
		getDateString(referenceDate ?? new Date()),
	);
	const scheduleItemsMap = new Map<
		string,
		| InstantaneousScheduleItemWithOptionalId<T>
		| RecurringScheduleItemInstanceWithOptionalId<T>
	>([
		...recurringScheduleItems
			.filter(scheduleItem => scheduleItem.isDisabled)
			.flatMap(activeItem =>
				getNextRecurringScheduleItemInstances(
					activeItem,
					maxItems,
					resolvedReferenceDate,
				),
			)
			.map(
				scheduleItem =>
					[
						`${getDateString(scheduleItem.date)}_${JSON.stringify(scheduleItem.venue)}`,
						scheduleItem,
					] as const,
			),
		...instantaneousScheduleItems
			.filter(
				scheduleItem =>
					!scheduleItem.isRemoved &&
					scheduleItem.date.getTime() >=
						resolvedReferenceDate.getTime(),
			)
			.map(
				scheduleItem =>
					[
						`${getDateString(scheduleItem.date)}_${JSON.stringify(scheduleItem.venue)}`,
						scheduleItem,
					] as const,
			),
	]);
	return scheduleItemsMap
		.values()
		.toArray()
		.toSorted((a, b) => a.date.getTime() - b.date.getTime())
		.slice(0, maxItems);
}

export function pickScheduleItemTranslation<
	T extends ScheduleItem<Translation>,
>(scheduleItem: T, target: Language) {
	return {
		...scheduleItem,
		title: pickTranslation(scheduleItem.title, target),
		venue: pickTranslation(scheduleItem.venue, target),
		times: scheduleItem.times.map(({ time, designation }) => ({
			time,
			designation: pickTranslation(designation, target),
		})),
	} satisfies ScheduleItem<string>;
}

export function parseNewScheduleItem(
	scheduleItem: NewInstantaneousScheduleItem,
): Omit<InstantaneousScheduleItem<Translation>, "id">;
export function parseNewScheduleItem(
	scheduleItem: NewRecurringScheduleItem,
): Omit<RecurringScheduleItem<Translation>, "id">;
export function parseNewScheduleItem(
	scheduleItem: NewInstantaneousScheduleItem | NewRecurringScheduleItem,
) {
	if ("recurringPattern" in scheduleItem)
		return {
			...scheduleItem,
			isDisabled: scheduleItem.isDisabled ?? false,
		};
	return {
		...scheduleItem,
		date: new Date(scheduleItem.date),
		isRemoved: scheduleItem.isRemoved ?? false,
	};
}

export function parseNewScheduleItemWithId(
	scheduleItem: NewInstantaneousScheduleItem,
	id: number,
): InstantaneousScheduleItem<Translation>;
export function parseNewScheduleItemWithId(
	scheduleItem: NewRecurringScheduleItem,
	id: number,
): RecurringScheduleItem<Translation>;
export function parseNewScheduleItemWithId(
	scheduleItem: NewInstantaneousScheduleItem | NewRecurringScheduleItem,
	id: number,
) {
	if ("recurringPattern" in scheduleItem)
		return { ...parseNewScheduleItem(scheduleItem), id };
	return { ...parseNewScheduleItem(scheduleItem), id };
}

export function recurringScheduleItemHasId<T extends Text>(
	item: RecurringScheduleItemWithOptionalId<T>,
): item is RecurringScheduleItem<T> {
	return "id" in item && item.id !== undefined;
}
export function recurringScheduleItemInstanceHasId<T extends Text>(
	item: RecurringScheduleItemInstanceWithOptionalId<T>,
): item is RecurringScheduleItemInstance<T> {
	return "recurringItemId" in item && item.recurringItemId !== undefined;
}
export function instantaneousScheduleItemHasId<T extends Text>(
	item: InstantaneousScheduleItemWithOptionalId<T>,
): item is InstantaneousScheduleItem<T> {
	return "id" in item && item.id !== undefined;
}
