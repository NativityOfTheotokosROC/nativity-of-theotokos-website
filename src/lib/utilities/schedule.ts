import { Cron } from "croner";
import { getLocalTimeZone } from "./date-time";

export function isValidRecurringPattern(pattern: string) {
	try {
		new Cron(pattern);
		return true;
	} catch {
		return false;
	}
}

export function getNextRecurringScheduleItemTimestamp(
	pattern: string,
	referenceDate?: string,
) {
	const cron = new Cron(pattern, { timezone: getLocalTimeZone() });
	return cron.nextRun(referenceDate);
}

export function getNextRecurringScheduleItemTimestamps(
	pattern: string,
	instances: number,
	referenceDate?: string,
) {
	const cron = new Cron(pattern, { timezone: getLocalTimeZone() });
	return cron.nextRuns(instances, referenceDate);
}
