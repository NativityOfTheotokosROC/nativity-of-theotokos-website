import { getSaints } from "@/src/lib/third-party/holytrinityorthodox";
import prisma from "@/src/lib/third-party/prisma";
import { getLocalTimeZone } from "@/src/lib/utilities/date-time";
import { load } from "cheerio";
import { addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { backOff } from "exponential-backoff";

export async function GET(request: Request) {
	const startDate = toZonedTime(
		new Date(new Date().getFullYear(), 0, 1).toDateString(),
		getLocalTimeZone(),
	);
	let nextDate = startDate;
	const ids = new Set<string>();
	while (nextDate.getFullYear() === startDate.getFullYear()) {
		const saints = await backOff(() => getSaints(nextDate, "en"));
		const $ = load(saints);
		$("a").each(function () {
			const pathParts = $(this).attr("href")!.split("/");
			ids.add(pathParts[pathParts.length - 1]);
		});
		nextDate = addDays(nextDate, 1);
	}
	const updates = await prisma.commemoration.createMany({
		data: [...ids.keys().map(id => ({ id: id }))],
		skipDuplicates: true,
	});
	return new Response(`Added: ${updates}`);
}
