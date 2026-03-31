import { format, formatInTimeZone, toZonedTime } from "date-fns-tz";

const DATEPICKER_DATE_FORMAT = "yyyy-MM-dd" as const;

export function getLocalTimeZone() {
	return "Africa/Harare" as const;
}

export function getDatePickerDate(date: Date, localTimezone?: boolean) {
	if (localTimezone)
		return formatInTimeZone(
			date,
			getLocalTimeZone(),
			DATEPICKER_DATE_FORMAT,
		);
	return format(date, DATEPICKER_DATE_FORMAT);
}

export function getNewsArticleFormattedDate(date: Date) {
	return toZonedTime(date, getLocalTimeZone()).toLocaleDateString("ru-RU", {
		dateStyle: "short",
	});
}
