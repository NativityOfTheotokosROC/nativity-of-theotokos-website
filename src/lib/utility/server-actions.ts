"use server";

import holytrinityorthodox from "../third-party/holytrinityorthodox";
import mailerLite from "../third-party/mailer-lite";
import { toZonedTime } from "date-fns-tz";

export async function subscribeToMailingList(email: string) {
	mailerLite.subscribers.createOrUpdate({ email });
}

export async function getDailyReadings() {
	const localDate = toZonedTime(new Date(), "CAT");
	return holytrinityorthodox.getDailyReadings(localDate);
}
