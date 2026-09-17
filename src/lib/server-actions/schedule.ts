"use server";

import { getTranslations } from "next-intl/server";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import z from "zod";
import database from "../third-party/prisma";
import { getDateString, getTimeString } from "../utilities/date-time";
import { getMd5Hash } from "../utilities/miscellaneous";
import {
	getNextRecurringScheduleItemDates,
	parseNewScheduleItemWithId,
} from "../utilities/schedule";
import {
	InstantaneousScheduleItem,
	Language,
	RecurringScheduleItemInstance,
} from "../utilities/types";
import {
	getInstantaneousScheduleItemSchema,
	getRecurringScheduleItemSchema,
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
} from "../validation/schedule-item";
import { protect } from "./auth";

export async function getSchedule(
	referenceDate: Date | string,
	limit: number = 10,
	locale: Language = "en",
	includeInactive: boolean = false,
) {
	"use cache: remote";
	cacheTag("schedule");
	cacheLife("hours");

	const parsedReferenceDate = new Date(
		typeof referenceDate === "string"
			? z.iso.date().parse(referenceDate)
			: getDateString(referenceDate, true),
	);

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
				removedScheduleItem: true,
			},
			where: {
				date: {
					gte: parsedReferenceDate,
				},
				removedScheduleItem: includeInactive ? undefined : null,
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
				disabledRecurringScheduleItem: true,
			},
			where: {
				disabledRecurringScheduleItem: includeInactive
					? undefined
					: null,
			},
		}),
		database.removedInstantaneousScheduleItem.findMany({
			include: {
				scheduleItem: true,
			},
			where: {
				scheduleItem: {
					date: {
						gte: parsedReferenceDate,
					},
				},
			},
		}),
	]);
	const instantaneousScheduleItems: Array<InstantaneousScheduleItem> =
		instantaneousScheduleItemRecords.map(
			({
				id,
				title,
				venue,
				date,
				instantaneousScheduleItemTimes,
				removedScheduleItem,
			}) => ({
				id,
				title:
					locale === "ru"
						? (title.russian ?? title.english)
						: title.english,
				venue:
					locale === "ru"
						? (venue.russian ?? venue.english)
						: venue.english,
				date,
				times: instantaneousScheduleItemTimes.map(
					({ designation, time }) => ({
						time: getTimeString(time),
						designation:
							locale === "ru"
								? (designation.russian ?? designation.english)
								: designation.english,
					}),
				),
				isRemoved: removedScheduleItem !== null,
			}),
		);
	const recurringScheduleItemInstanceExclusions = includeInactive
		? new Set([
				...instantaneousScheduleItemRecords.map(
					({ venueTranslationId, date }) =>
						JSON.stringify({ date, venueTranslationId }),
				),
			])
		: new Set([
				...instantaneousScheduleItemRecords.map(
					({ venueTranslationId, date }) =>
						JSON.stringify({ date, venueTranslationId }),
				),
				...removedInstantaneousScheduleItemRecords.map(
					({ scheduleItem: { date, venueTranslationId } }) =>
						JSON.stringify({ date, venueTranslationId }),
				),
			]);
	const recurringScheduleItemInstances =
		new Array<RecurringScheduleItemInstance>();
	recurringScheduleItemRecords.forEach(
		({
			id,
			title,
			venue,
			pattern,
			recurringScheduleItemTimes,
			disabledRecurringScheduleItem,
		}) => {
			const nextDates = getNextRecurringScheduleItemDates(
				pattern,
				limit,
				parsedReferenceDate,
			);
			nextDates.forEach(date => {
				if (
					!recurringScheduleItemInstanceExclusions.has(
						JSON.stringify({ date, venueTranslationId: venue.id }),
					)
				)
					recurringScheduleItemInstances.push({
						recurringItemId: id,
						title:
							locale === "ru"
								? (title.russian ?? title.english)
								: title.english,
						venue:
							locale === "ru"
								? (venue.russian ?? venue.english)
								: venue.english,
						date,
						times: recurringScheduleItemTimes.map(
							({ time, designation }) => ({
								designation:
									locale === "ru"
										? (designation.russian ??
											designation.english)
										: designation.english,
								time: getTimeString(time),
							}),
						),
						isRemoved: disabledRecurringScheduleItem !== null,
					});
			});
		},
	);
	const scheduleItems: Array<
		InstantaneousScheduleItem | RecurringScheduleItemInstance
	> = [...instantaneousScheduleItems, ...recurringScheduleItemInstances]
		.toSorted((a, b) => a.date.getTime() - b.date.getTime())
		.slice(0, limit);
	return scheduleItems;
}

export async function scheduleInstantaneousItem(
	newScheduleItem: NewInstantaneousScheduleItem,
	locale?: Language,
) {
	await protect({ roles: ["admin"] });
	const t = await getTranslations({ locale: locale ?? "en" });
	const scheduleItemSchema = getInstantaneousScheduleItemSchema(t);
	const { title, venue, date, times, isRemoved } =
		scheduleItemSchema.parse(newScheduleItem);
	const result = await database.$transaction(async transaction => {
		const venueTranslation = await transaction.translation.findUnique({
			where: {
				englishHash: getMd5Hash(venue.english),
			},
		});
		if (venueTranslation)
			await transaction.instantaneousScheduleItem.delete({
				where: {
					venueTranslationId_date: {
						venueTranslationId: venueTranslation.id,
						date,
					},
					removedScheduleItem: { isNot: null },
				},
			});
		const scheduleItem = await transaction.instantaneousScheduleItem.create(
			{
				data: {
					title: {
						connectOrCreate: {
							create: {
								english: title.english,
								russian: title.russian,
								englishHash: getMd5Hash(title.english),
							},
							where: {
								englishHash: getMd5Hash(title.english),
							},
						},
					},
					venue: {
						connectOrCreate: {
							create: {
								english: venue.english,
								russian: venue.russian,
								englishHash: getMd5Hash(venue.english),
							},
							where: {
								englishHash: getMd5Hash(venue.english),
							},
						},
					},
					date,
					removedScheduleItem: isRemoved ? { create: {} } : undefined,
				},
			},
		);
		for (const { designation, time } of times) {
			await transaction.instantaneousScheduleItemTime.create({
				data: {
					instantaneousScheduledItem: {
						connect: {
							id: scheduleItem.id,
						},
					},
					designation: {
						connectOrCreate: {
							create: {
								english: designation.english,
								russian: designation.russian,
								englishHash: getMd5Hash(designation.english),
							},
							where: {
								englishHash: getMd5Hash(designation.english),
							},
						},
					},
					time,
				},
			});
		}
		return scheduleItem;
	});
	revalidateTag("schedule", "max");
	return parseNewScheduleItemWithId(
		{ title, venue, times, date, isRemoved },
		result.id,
	);
}

export async function scheduleRecurringItem(
	newScheduleItem: NewRecurringScheduleItem,
	locale?: Language,
) {
	await protect({ roles: ["admin"] });
	const t = await getTranslations({ locale: locale ?? "en" });
	const scheduleItemSchema = getRecurringScheduleItemSchema(t);
	const { title, venue, recurringPattern, times, isDisabled } =
		scheduleItemSchema.parse(newScheduleItem);
	const result = await database.$transaction(async transaction => {
		const scheduleItem = await transaction.recurringScheduleItem.create({
			data: {
				title: {
					connectOrCreate: {
						create: {
							english: title.english,
							russian: title.russian,
							englishHash: getMd5Hash(title.english),
						},
						where: {
							englishHash: getMd5Hash(title.english),
						},
					},
				},
				venue: {
					connectOrCreate: {
						create: {
							english: venue.english,
							russian: venue.russian,
							englishHash: getMd5Hash(venue.english),
						},
						where: {
							englishHash: getMd5Hash(venue.english),
						},
					},
				},
				pattern: recurringPattern,
				disabledRecurringScheduleItem: isDisabled
					? { create: {} }
					: undefined,
			},
		});
		for (const { designation, time } of times) {
			await transaction.recurringScheduleItemTime.create({
				data: {
					recurringScheduledItem: {
						connect: {
							id: scheduleItem.id,
						},
					},
					designation: {
						connectOrCreate: {
							create: {
								english: designation.english,
								russian: designation.russian,
								englishHash: getMd5Hash(designation.english),
							},
							where: {
								englishHash: getMd5Hash(designation.english),
							},
						},
					},
					time,
				},
			});
		}
		return scheduleItem;
	});
	revalidateTag("schedule", "max");
	return parseNewScheduleItemWithId(
		{ title, venue, times, recurringPattern, isDisabled },
		result.id,
	);
}

export async function updateInstantaneousItem(
	scheduleItemId: number,
	newScheduleItem: NewInstantaneousScheduleItem,
	locale?: Language,
) {
	await protect({ roles: ["admin"] });
	const t = await getTranslations({ locale: locale ?? "en" });
	const { title, venue, date, times, isRemoved } =
		getInstantaneousScheduleItemSchema(t).parse(newScheduleItem);
	await database.$transaction(async transaction => {
		await transaction.instantaneousScheduleItem.update({
			data: {
				title: {
					upsert: {
						create: {
							english: title.english,
							russian: title.russian,
							englishHash: getMd5Hash(title.english),
						},
						update: {
							russian: title.russian,
						},
						where: { englishHash: getMd5Hash(title.english) },
					},
				},
				venue: {
					upsert: {
						create: {
							english: venue.english,
							russian: venue.russian,
							englishHash: getMd5Hash(venue.english),
						},
						update: {
							russian: venue.russian,
						},
						where: { englishHash: getMd5Hash(venue.english) },
					},
				},
				date,
				instantaneousScheduleItemTimes: {
					set: await Promise.all(
						times.map(
							async ({
								time,
								designation: { english, russian },
							}) => {
								const designationTranslation =
									await transaction.translation.upsert({
										create: {
											english,
											russian,
											englishHash: getMd5Hash(english),
										},
										update: {
											russian,
										},
										where: {
											englishHash: getMd5Hash(english),
										},
									});
								return {
									designationTranslationId_time: {
										time,
										designationTranslationId:
											designationTranslation.id,
									},
								};
							},
						),
					),
				},
				removedScheduleItem:
					isRemoved !== undefined
						? isRemoved
							? {
									connectOrCreate: {
										create: {},
										where: {
											instantaneousScheduleItemId:
												scheduleItemId,
										},
									},
								}
							: {
									delete: {
										instantaneousScheduleItemId:
											scheduleItemId,
									},
								}
						: undefined,
			},
			where: {
				id: scheduleItemId,
			},
		});
	});
	revalidateTag("schedule", "max");
}

export async function updateRecurringItem(
	scheduleItemId: number,
	newScheduleItem: NewRecurringScheduleItem,
	locale?: Language,
) {
	await protect({ roles: ["admin"] });
	const t = await getTranslations({ locale: locale ?? "en" });
	const { title, venue, recurringPattern, times, isDisabled } =
		getRecurringScheduleItemSchema(t).parse(newScheduleItem);

	await database.$transaction(async transaction => {
		await transaction.recurringScheduleItem.update({
			data: {
				title: {
					upsert: {
						create: {
							english: title.english,
							russian: title.russian,
							englishHash: getMd5Hash(title.english),
						},
						update: {
							russian: title.russian,
						},
						where: { englishHash: getMd5Hash(title.english) },
					},
				},
				venue: {
					upsert: {
						create: {
							english: venue.english,
							russian: venue.russian,
							englishHash: getMd5Hash(venue.english),
						},
						update: {
							russian: venue.russian,
						},
						where: { englishHash: getMd5Hash(venue.english) },
					},
				},
				pattern: recurringPattern,
				recurringScheduleItemTimes: {
					set: await Promise.all(
						times.map(
							async ({
								time,
								designation: { english, russian },
							}) => {
								const designationTranslation =
									await transaction.translation.upsert({
										create: {
											english,
											russian,
											englishHash: getMd5Hash(english),
										},
										update: {
											russian,
										},
										where: {
											englishHash: getMd5Hash(english),
										},
									});
								return {
									designationTranslationId_time: {
										time,
										designationTranslationId:
											designationTranslation.id,
									},
								};
							},
						),
					),
				},
				disabledRecurringScheduleItem:
					isDisabled !== undefined
						? isDisabled
							? {
									connectOrCreate: {
										create: {},
										where: {
											recurringScheduleItemId:
												scheduleItemId,
										},
									},
								}
							: {
									delete: {
										recurringScheduleItemId: scheduleItemId,
									},
								}
						: undefined,
			},
			where: {
				id: scheduleItemId,
			},
		});
	});
	revalidateTag("schedule", "max");
}

export async function removeInstantaneousItem(
	identifier: number | { venue: string; date: string },
) {
	await protect({ roles: ["admin"] });
	await database.removedInstantaneousScheduleItem.create({
		data: {
			scheduleItem: {
				connect:
					typeof identifier === "number"
						? {
								id: identifier,
							}
						: {
								venueTranslationId_date: {
									venueTranslationId: (
										await database.translation.findUniqueOrThrow(
											{
												where: {
													englishHash: getMd5Hash(
														identifier.venue,
													),
												},
											},
										)
									).id,
									date: z.iso.date().parse(identifier.date),
								},
							},
			},
		},
	});
	revalidateTag("schedule", "max");
}

export async function restoreInstantaneousItem(scheduleItemId: number) {
	await protect({ roles: ["admin"] });
	await database.removedInstantaneousScheduleItem.delete({
		where: {
			instantaneousScheduleItemId: scheduleItemId,
		},
	});
	revalidateTag("schedule", "max");
}

export async function removeNextRecurringItem(
	scheduleItemId: number,
	instance?: number,
	referenceDate?: Date | string,
) {
	await protect({ roles: ["admin"] });
	const recurringScheduleItem =
		await database.recurringScheduleItem.findUniqueOrThrow({
			include: {
				title: true,
				venue: true,
			},
			where: {
				id: scheduleItemId,
			},
		});
	const parsedReferenceDate =
		typeof referenceDate === "string"
			? z.iso.date().optional().parse(referenceDate)
			: referenceDate !== undefined
				? getDateString(referenceDate, true)
				: undefined;
	const specificDate = getNextRecurringScheduleItemDates(
		recurringScheduleItem.pattern,
		instance ?? 1,
		parsedReferenceDate,
	).pop();
	if (!specificDate) return;
	const existingScheduleItem =
		await database.instantaneousScheduleItem.findUnique({
			where: {
				venueTranslationId_date: {
					venueTranslationId:
						recurringScheduleItem.venueTranslationId,
					date: specificDate,
				},
			},
		});
	if (!existingScheduleItem)
		await database.removedInstantaneousScheduleItem.create({
			data: {
				scheduleItem: {
					create: {
						titleTranslationId:
							recurringScheduleItem.titleTranslationId,
						venueTranslationId:
							recurringScheduleItem.venueTranslationId,
						date: specificDate,
					},
				},
			},
		});
	revalidateTag("schedule", "max");
}

export async function toggleRecurringItem(
	scheduleItemId: number,
	isEnabled: boolean,
) {
	await protect({ roles: ["admin"] });
	await database.recurringScheduleItem.update({
		data: {
			disabledRecurringScheduleItem: isEnabled
				? { connect: { recurringScheduleItemId: scheduleItemId } }
				: { delete: true },
		},
		where: { id: scheduleItemId },
	});
	revalidateTag("schedule", "max");
}

export async function deleteInstantaneousScheduleItem(scheduleItemId: number) {
	await protect({ roles: ["admin"] });
	await database.instantaneousScheduleItem.delete({
		where: { id: scheduleItemId },
	});
	revalidateTag("schedule", "max");
}

export async function deleteRecurringScheduleItem(scheduleItemId: number) {
	await protect({ roles: ["admin"] });
	await database.recurringScheduleItem.delete({
		where: { id: scheduleItemId },
	});
	revalidateTag("schedule", "max");
}
