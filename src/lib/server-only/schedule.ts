import "server-only";
import database from "../third-party/prisma";
import { getDateString, getTimeString } from "../utilities/date-time";
import {
	InstantaneousScheduleItem,
	Language,
	RecurringScheduleItem,
	ScheduleItem,
	Translation,
} from "../utilities/types";
import { cacheTag, cacheLife } from "next/cache";
import { pickTranslation } from "../utilities/miscellaneous";
import { generateSchedule } from "../utilities/schedule";

export async function getSchedule(
	referenceDate: Date,
	limit: number = 10,
	locale: Language = "en",
) {
	"use cache: remote";
	cacheTag("schedule");
	cacheLife("hours");

	const [
		instantaneousScheduleItemRecords,
		recurringScheduleItemRecords,
		removedInstantaneousScheduleItemRecords,
	] = await Promise.all([
		database.instantaneousScheduleItem.findMany({
			include: {
				title: true,
				venue: true,
				instantaneousScheduleItemTimes: {
					include: {
						designation: true,
					},
					orderBy: {
						time: "asc",
					},
				},
			},
			where: {
				date: {
					gte: referenceDate,
				},
				removedScheduleItem: null,
			},
			orderBy: {
				date: "asc",
			},
			take: limit,
		}),
		database.recurringScheduleItem.findMany({
			include: {
				title: true,
				venue: true,
				recurringScheduleItemTimes: {
					include: {
						designation: true,
					},
					orderBy: {
						time: "asc",
					},
				},
			},
			where: {
				disabledRecurringScheduleItem: null,
			},
		}),
		database.removedInstantaneousScheduleItem.findMany({
			include: {
				scheduleItem: {
					include: {
						venue: true,
					},
				},
			},
			where: {
				scheduleItem: {
					date: {
						gte: referenceDate,
					},
				},
			},
		}),
	]);
	const instantaneousScheduleItems = instantaneousScheduleItemRecords.map(
		({
			id,
			title,
			venue,
			date,
			eventTypeName,
			instantaneousScheduleItemTimes,
		}) =>
			({
				id,
				title: pickTranslation(title, locale),
				venue: pickTranslation(venue, locale),
				date,
				times: instantaneousScheduleItemTimes.map(
					({ designation, time }) => ({
						time: getTimeString(time),
						designation: pickTranslation(designation, locale),
					}),
				),
				isRemoved: false,
				eventType: eventTypeName as ScheduleItem["eventType"],
			}) satisfies InstantaneousScheduleItem,
	);
	const recurringScheduleItems = recurringScheduleItemRecords.map(
		({
			id,
			title,
			venue,
			pattern,
			eventTypeName,
			recurringScheduleItemTimes,
		}) =>
			({
				id,
				title: pickTranslation(title, locale),
				venue: pickTranslation(venue, locale),
				recurringPattern: pattern,
				times: recurringScheduleItemTimes.map(
					({ time, designation }) => ({
						designation: pickTranslation(designation, locale),
						time: getTimeString(time),
					}),
				),
				isDisabled: false,
				eventType: eventTypeName as ScheduleItem["eventType"],
			}) satisfies RecurringScheduleItem,
	);
	const recurringScheduleItemInstanceExclusions = new Set([
		...removedInstantaneousScheduleItemRecords.map(
			({ scheduleItem: { date, venue } }) =>
				`${getDateString(date)}_${pickTranslation(venue, locale)}`,
		),
	]);
	const schedule = generateSchedule(
		instantaneousScheduleItems,
		recurringScheduleItems,
		limit + recurringScheduleItemInstanceExclusions.size,
		referenceDate,
	);
	return recurringScheduleItemInstanceExclusions.size > 0
		? schedule.filter(scheduleItem =>
				"recurringItemId" in scheduleItem
					? !recurringScheduleItemInstanceExclusions.has(
							`${getDateString(scheduleItem.date)}_${scheduleItem.venue}`,
						)
					: true,
			)
		: schedule;
}

export async function getScheduleItems(referenceDate: Date) {
	const [instantaneousScheduleItemRecords, recurringScheduleItemRecords] =
		await Promise.all([
			database.instantaneousScheduleItem.findMany({
				include: {
					title: true,
					venue: true,
					instantaneousScheduleItemTimes: {
						include: {
							designation: true,
						},
						orderBy: {
							time: "asc",
						},
					},
					removedScheduleItem: true,
				},
				where: {
					date: {
						gte: referenceDate,
					},
				},
				orderBy: {
					date: "asc",
				},
			}),
			database.recurringScheduleItem.findMany({
				include: {
					title: true,
					venue: true,
					recurringScheduleItemTimes: {
						include: {
							designation: true,
						},
						orderBy: {
							time: "asc",
						},
					},
					disabledRecurringScheduleItem: true,
				},
			}),
		]);

	return {
		instantaneous: instantaneousScheduleItemRecords.map(
			({
				title,
				venue,
				date,
				id,
				instantaneousScheduleItemTimes,
				removedScheduleItem,
				eventTypeName,
			}) => ({
				id,
				title,
				venue,
				date,
				isRemoved: removedScheduleItem !== null,
				times: instantaneousScheduleItemTimes.map(
					({ designation, time }) => ({
						designation,
						time: getTimeString(time),
					}),
				),
				eventType: eventTypeName as ScheduleItem["eventType"],
			}),
		),
		recurring: recurringScheduleItemRecords.map(
			({
				id,
				title,
				venue,
				pattern,
				recurringScheduleItemTimes,
				disabledRecurringScheduleItem,
				eventTypeName,
			}) => ({
				id,
				title,
				venue,
				recurringPattern: pattern,
				isDisabled: disabledRecurringScheduleItem !== null,
				eventType: eventTypeName as ScheduleItem["eventType"],
				times: recurringScheduleItemTimes.map(
					({ designation, time }) => ({
						designation,
						time: getTimeString(time),
					}),
				),
			}),
		),
	} satisfies {
		instantaneous: InstantaneousScheduleItem<Translation>[];
		recurring: RecurringScheduleItem<Translation>[];
	};
}

export async function getAutoCompleteInfo() {
	const [titleTranslations, venueTranslations, designationTranslations] =
		await Promise.all([
			database.translation.findMany({
				where: {
					OR: [
						{ recurringScheduleItemTitles: { some: {} } },
						{ instantaneousScheduleItemTitles: { some: {} } },
					],
				},
			}),
			database.translation.findMany({
				where: {
					OR: [
						{ recurringScheduleItemVenues: { some: {} } },
						{ instantaneousScheduleItemsVenues: { some: {} } },
					],
				},
			}),
			database.translation.findMany({
				where: {
					OR: [
						{ recurringTimeDesignationTranslations: { some: {} } },
						{
							instantaneousTimeDesignationTranslations: {
								some: {},
							},
						},
					],
				},
			}),
		]);
	return {
		titleTranslations,
		venueTranslations,
		designationTranslations,
	} satisfies {
		titleTranslations: Translation[];
		venueTranslations: Translation[];
		designationTranslations: Translation[];
	};
}
