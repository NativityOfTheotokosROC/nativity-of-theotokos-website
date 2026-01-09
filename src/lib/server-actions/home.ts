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

console.error(process.env.DATABASE_URL);

export async function getHomeSnapshot(): Promise<HomeSnapshot> {
	const prismaClient = new PrismaClient({
		adapter: prismaAdapter,
	});
	const dailyReadings = await getDailyReadings();
	const dailyQuote = await prismaClient.quote.findFirst();

	return {
		dailyReadings,
		dailyQuote: dailyQuote!,
	};
}

export async function subscribeToMailingList(email: string) {
	mailerLite.subscribers.createOrUpdate({ email });
}

export async function getDailyReadings() {
	const localDate = toZonedTime(new Date(), "CAT");
	return holytrinityorthodox.getDailyReadings(localDate);
}
