import { format, formatInTimeZone, toZonedTime } from "date-fns-tz";
import { Language } from "./types";

export const DATE_FORMAT = "yyyy-MM-dd" as const;
export const TIME_FORMAT = "HH:mm";
export const ENGLISH_DATE_LOCALE = "en-uk";
export const RUSSIAN_DATE_LOCALE = "ru-RU";

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
export function pickTimeTranslation(
	date: Date,
	target: Language,
	picks?: Partial<{ hour: boolean; minute: boolean; twelveHour: boolean }>,
) {
	const dateLocale =
		target === "ru" ? RUSSIAN_DATE_LOCALE : ENGLISH_DATE_LOCALE;
	const pickDefault =
		(picks?.hour && picks?.minute && picks?.twelveHour) === undefined;
	return date
		.toLocaleTimeString(
			dateLocale,
			pickDefault
				? {
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					}
				: {},
		)
		.toUpperCase();
}
export function pickDateTranslation(
	date: Date,
	target: Language,
	picks?: Partial<{ day: boolean; month: boolean; year: boolean }>,
) {
	const dateLocale =
		target === "ru" ? RUSSIAN_DATE_LOCALE : ENGLISH_DATE_LOCALE;
	const pickDefault =
		(picks?.day && picks?.month && picks?.year) === undefined;
	return date.toLocaleDateString(
		dateLocale,
		pickDefault
			? {
					day: "2-digit",
					month: "short",
					year: "2-digit",
				}
			: {
					day: picks?.day ? "2-digit" : undefined,
					month: picks?.month ? "short" : undefined,
					year: picks?.year ? "2-digit" : undefined,
				},
	);
}
