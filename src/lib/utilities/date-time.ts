import { format, formatInTimeZone, toZonedTime } from "date-fns-tz";

const DATEPICKER_DATE_FORMAT = "yyyy-MM-dd" as const;

export function getLocalTimeZone() {
	return "Africa/Harare" as const;
}

export function getDateString(date: Date, localTimezone?: boolean) {
	if (localTimezone)
		return formatInTimeZone(
			date,
			getLocalTimeZone(),
			DATEPICKER_DATE_FORMAT,
		);
	return format(date, DATEPICKER_DATE_FORMAT);
}

export function getNewsArticleDateString(date: Date) {
	return toZonedTime(date, getLocalTimeZone()).toLocaleDateString("ru-RU", {
		dateStyle: "short",
	});
}
