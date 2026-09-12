import { format, formatInTimeZone, toZonedTime } from "date-fns-tz";

const DATE_FORMAT = "yyyy-MM-dd" as const;
const TIME_FORMAT = "HH:mm";

export function getNativeTimeZone() {
	return "Africa/Harare" as const;
}

export function getFormattedDateString(
	date: Date,
	dateFormat: string,
	nativeTimezone?: boolean,
) {
	if (nativeTimezone)
		return formatInTimeZone(date, getNativeTimeZone(), dateFormat);
	return format(date, dateFormat);
}

export function getDateString(date: Date, nativeTimezone?: boolean) {
	return getFormattedDateString(date, DATE_FORMAT, nativeTimezone);
}

export function getTimeString(date: Date, nativeTimezone?: boolean) {
	return getFormattedDateString(date, TIME_FORMAT, nativeTimezone);
}

export function getNewsArticleDateString(date: Date) {
	return toZonedTime(date, getNativeTimeZone()).toLocaleDateString("ru-RU", {
		dateStyle: "short",
	});
}
