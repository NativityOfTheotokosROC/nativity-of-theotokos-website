"use server";

import { DailyQuote, DailyReadings, ScheduleItem } from "../type/miscellaneous";
import holytrinityorthodox from "../third-party/holytrinityorthodox";
import mailerLite from "../third-party/mailer-lite";
import { toZonedTime } from "date-fns-tz";
import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export type HomeSnapshot = {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
	scheduleItems: ScheduleItem[];
};

const prismaAdapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prismaClient = new PrismaClient({
	adapter: prismaAdapter,
});

export async function getHomeSnapshot(): Promise<HomeSnapshot> {
	const scheduleItems = await getScheduleItems();
	const dailyReadings = await getDailyReadings();
	const localDate = toZonedTime(dailyReadings.currentDate, "CAT");
	let dailyQuote = await prismaClient.dailyQuote
		.findFirst({
			where: {
				date: localDate,
			},
		})
		.quote();
	if (!dailyQuote) {
		const quotes = await prismaClient.quote.findMany()!;
		dailyQuote = quotes[Math.round(Math.random() * (quotes.length - 1))];
		await prismaClient.dailyQuote.create({
			data: {
				date: localDate,
				quoteId: dailyQuote.id,
			},
		});
	}

	return {
		dailyReadings,
		dailyQuote,
		scheduleItems,
	};
}

export async function subscribeToMailingList(email: string) {
	mailerLite.subscribers.createOrUpdate({ email });
}

export async function getDailyReadings() {
	return holytrinityorthodox.getDailyReadings(new Date());
}

export async function getScheduleItems() {
	const size = 4;
	const localDate = new Date();
	const data = await prismaClient.scheduleItem.findMany({
		where: {
			date: { gte: localDate },
			removedScheduleItem: { is: null },
		},
		take: size,
		include: { scheduleItemTimes: true },
	});
	const scheduleItems = data.map(
		(record): ScheduleItem => ({
			date: record.date,
			title: record.title,
			location: record.location,
			times: record.scheduleItemTimes,
		})
	);
	let nextScheduleItemDate = new Date(localDate);
	while (scheduleItems.length < size) {
		const nextScheduleItem = await getNextDefaultScheduleItem(
			nextScheduleItemDate
		);
		const isPresent = await prismaClient.scheduleItem.count({
			where: {
				date: { equals: nextScheduleItem.date },
				removedScheduleItem: { is: null },
			},
		});
		if (!isPresent) {
			const { date, location, title, times } = nextScheduleItem;
			await prismaClient.scheduleItem.create({
				data: {
					date,
					location,
					title,
					scheduleItemTimes: { createMany: { data: times } },
				},
			});
			scheduleItems.push(nextScheduleItem);
		}
		nextScheduleItemDate = new Date(
			new Date(nextScheduleItem.date).setDate(
				nextScheduleItem.date.getDate() + 1
			)
		);
	}
	return scheduleItems;
}

// TODO: To be refactored to something less ... static
export async function getNextDefaultScheduleItem(
	date: Date
): Promise<ScheduleItem> {
	const scheduleItemDate = new Date(date);
	while (scheduleItemDate.getDay() > 0 && scheduleItemDate.getDay() < 6) {
		scheduleItemDate.setDate(scheduleItemDate.getDate() + 1);
	}
	if (scheduleItemDate.getDay() == 6) {
		const nextSundayDate = new Date(
			new Date(scheduleItemDate).setDate(scheduleItemDate.getDate() + 1)
		);
		const previousSundayDate = new Date(
			new Date(scheduleItemDate).setDate(scheduleItemDate.getDate() - 6)
		);
		if (nextSundayDate.getMonth() != previousSundayDate.getMonth())
			return {
				date: scheduleItemDate,
				location: "Nativity of Theotokos Parish",
				title: "Divine Liturgy",
				times: [
					{
						time: new Date(
							new Date(scheduleItemDate).setHours(12, 0, 0, 0)
						),
						designation: "Hours",
					},
					{
						time: new Date(
							new Date(scheduleItemDate).setHours(12, 30, 0, 0)
						),
						designation: "Confessions",
					},
					{
						time: new Date(
							new Date(scheduleItemDate).setHours(13, 0, 0, 0)
						),
						designation: "Liturgy",
					},
				],
			};
		return {
			date: nextSundayDate,
			location: "St. Sergius Parish",
			title: "Typika Service",
			times: [
				{
					time: new Date(
						new Date(nextSundayDate).setHours(9, 0, 0, 0)
					),
					designation: "Hours",
				},
				{
					time: new Date(
						new Date(nextSundayDate).setHours(9, 30, 0, 0)
					),
					designation: "Typika",
				},
				{
					time: new Date(
						new Date(nextSundayDate).setHours(10, 30, 0, 0)
					),
					designation: "Catechism",
				},
			],
		};
	} else {
		const previousSundayDate = new Date(
			new Date(scheduleItemDate).setDate(scheduleItemDate.getDate() - 7)
		);
		if (scheduleItemDate.getMonth() != previousSundayDate.getMonth())
			return {
				date: scheduleItemDate,
				location: "St. Sergius Parish",
				title: "Divine Liturgy",
				times: [
					{
						time: new Date(
							new Date(scheduleItemDate).setHours(9, 0, 0, 0)
						),
						designation: "Hours",
					},
					{
						time: new Date(
							new Date(scheduleItemDate).setHours(9, 30, 0, 0)
						),
						designation: "Confessions",
					},
					{
						time: new Date(
							new Date(scheduleItemDate).setHours(10, 0, 0, 0)
						),
						designation: "Liturgy",
					},
				],
			};
		return await getNextDefaultScheduleItem(
			new Date(
				new Date(scheduleItemDate).setDate(
					scheduleItemDate.getDate() - 1
				)
			)
		); // HACK
	}
}
