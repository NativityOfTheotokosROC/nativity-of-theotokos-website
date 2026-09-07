"use server";

import { revalidateTag } from "next/cache";
import database from "../third-party/prisma";
import {
	getInstantaneousScheduleItemSchema,
	getRecurringScheduleItemSchema,
	NewInstantaneousScheduleItem,
	NewRecurringScheduleItem,
} from "../validation/schedule";
import {
	InstantaneousScheduleItem,
	Language,
	RecurringScheduleItemInstance,
} from "../types/general";
import { getTranslations } from "next-intl/server";
import { getMd5Hash } from "../utilities/miscellaneous";
import { protect } from "./auth";
import { getNextRecurringScheduleItemDates } from "../utilities/schedule";
import z from "zod";
import { getDateString } from "../utilities/date-time";
import { cacheTag } from "next/cache";
import { cacheLife } from "next/cache";

export async function getSchedule(
	referenceDate: Date | string,
	limit: number = 4,
	locale: Language = "en",
) {
	"use cache: remote";
	cacheTag("schedule");
	cacheLife("hours");

	const parsedReferenceDate = z.iso.date().parse(referenceDate);

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
					gte: parsedReferenceDate,
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
			({ id, title, venue, date, instantaneousScheduleItemTimes }) => ({
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
						time,
						designation:
							locale === "ru"
								? (designation.russian ?? designation.english)
								: designation.english,
					}),
				),
			}),
		);
	const recurringScheduleItemInstanceExclusions = new Set([
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
		({ id, title, venue, pattern, recurringScheduleItemTimes }) => {
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
								time,
							}),
						),
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
	const { title, venue, date, scheduleItemTimes } =
		scheduleItemSchema.parse(newScheduleItem);
	await database.$transaction(async transaction => {
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
				},
			},
		);
		for (const { designation, time } of scheduleItemTimes) {
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
	});
	revalidateTag("schedule", "max");
}

export async function scheduleRecurringItem(
	newScheduleItem: NewRecurringScheduleItem,
	locale?: Language,
) {
	await protect({ roles: ["admin"] });
	const t = await getTranslations({ locale: locale ?? "en" });
	const scheduleItemSchema = getRecurringScheduleItemSchema(t);
	const { title, venue, recurringPattern, scheduleItemTimes } =
		scheduleItemSchema.parse(newScheduleItem);
	await database.$transaction(async transaction => {
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
			},
		});
		for (const { designation, time } of scheduleItemTimes) {
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
	});
	revalidateTag("schedule", "max");
}

export async function updateInstantaneousItem(
	scheduleItemId: number,
	newScheduleItem: NewInstantaneousScheduleItem,
	locale?: Language,
) {
	await protect({ roles: ["admin"] });
	const t = await getTranslations({ locale: locale ?? "en" });
	const { title, venue, date, scheduleItemTimes } =
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
						scheduleItemTimes.map(
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
	const { title, venue, recurringPattern, scheduleItemTimes } =
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
						scheduleItemTimes.map(
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
	const parsedReferenceDate = z.iso.date().optional().parse(referenceDate);
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
