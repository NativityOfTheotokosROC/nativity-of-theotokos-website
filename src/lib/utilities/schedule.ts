import { Cron } from "croner";
import { getLocalTimeZone } from "./date-time";

export function validateRecurringPattern(
	pattern: string,
	options?: Partial<{ useLocalTimezone: boolean }>,
) {
	try {
		const cron = new Cron(
			pattern,
			options?.useLocalTimezone
				? { timezone: getLocalTimeZone() }
				: undefined,
		);
		if (!cron.getPattern()?.startsWith("0 0 0")) return null;
		return cron;
	} catch {
		return null;
	}
}

export function getNextRecurringScheduleItemDate(
	pattern: string,
	referenceDate?: string,
) {
	const cron = validateRecurringPattern(pattern, { useLocalTimezone: true });
	if (!cron) throw new Error("Invalid recurring pattern");
	return cron.nextRun(referenceDate);
}

export function getNextRecurringScheduleItemDates(
	pattern: string,
	instances: number,
	referenceDate?: string,
) {
	const cron = validateRecurringPattern(pattern, { useLocalTimezone: true });
	if (!cron) throw new Error("Invalid recurring pattern");
	return cron.nextRuns(instances, referenceDate);
}
