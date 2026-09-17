import "server-only";
import z from "zod";
import { protect } from "../server-actions/auth";
import database from "../third-party/prisma";
import {
	InstantaneousScheduleItem,
	Translation,
	RecurringScheduleItem,
} from "../utilities/types";
import { getDateString, getTimeString } from "../utilities/date-time";

export async function getScheduleItems(referenceDate: Date | string) {
	await protect({ roles: ["admin"] });
	const parsedReferenceDate =
		typeof referenceDate === "string"
			? z.iso.date().parse(referenceDate)
			: getDateString(referenceDate, true);

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
						gte: parsedReferenceDate,
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
			}) => ({
				id,
				title,
				venue,
				date,
				isRemoved: removedScheduleItem !== null,
				times: instantaneousScheduleItemTimes.map(
					({ designation, time }) => ({
						designation,
						time: getTimeString(time, true),
					}),
				),
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
			}) => ({
				id,
				title,
				venue,
				recurringPattern: pattern,
				isDisabled: disabledRecurringScheduleItem !== null,
				times: recurringScheduleItemTimes.map(
					({ designation, time }) => ({
						designation,
						time: getTimeString(time, true),
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
						{ recurringScheduleItemTitles: { every: {} } },
						{ instantaneousScheduleItemTitles: { every: {} } },
					],
				},
			}),
			database.translation.findMany({
				where: {
					OR: [
						{ recurringScheduleItemVenues: { every: {} } },
						{ instantaneousScheduleItemsVenues: { every: {} } },
					],
				},
			}),
			database.translation.findMany({
				where: {
					OR: [
						{ recurringTimeDesignationTranslations: { every: {} } },
						{
							instantaneousTimeDesignationTranslations: {
								every: {},
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
