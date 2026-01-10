"use server";

import { DailyQuote, DailyReadings } from "../type/miscellaneous";
import holytrinityorthodox from "../third-party/holytrinityorthodox";
import mailerLite from "../third-party/mailer-lite";
import { toZonedTime } from "date-fns-tz";
import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export type HomeSnapshot = {
	dailyReadings: DailyReadings;
	dailyQuote: DailyQuote;
};

const prismaAdapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prismaClient = new PrismaClient({
	adapter: prismaAdapter,
});

export async function getHomeSnapshot(): Promise<HomeSnapshot> {
	const dailyReadings = await getDailyReadings();
	let dailyQuote = await prismaClient.dailyQuote
		.findFirst({
			where: {
				date: dailyReadings.currentDate,
			},
		})
		.quote();
	if (!dailyQuote) {
		console.log(`Which is it: ${dailyQuote}`);
		const quotes = await prismaClient.quote.findMany()!;
		dailyQuote = quotes[Math.round(Math.random() * (quotes.length - 1))];
		await prismaClient.dailyQuote.create({
			data: {
				date: dailyReadings.currentDate,
				quoteId: dailyQuote.id,
			},
		});
	}

	return {
		dailyReadings,
		dailyQuote,
	};
}

export async function subscribeToMailingList(email: string) {
	mailerLite.subscribers.createOrUpdate({ email });
}

export async function getDailyReadings() {
	const localDate = toZonedTime(new Date(), "CAT");
	return holytrinityorthodox.getDailyReadings(localDate);
}
