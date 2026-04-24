import { getSaints } from "@/src/lib/third-party/holytrinityorthodox";
import prisma from "@/src/lib/third-party/prisma";
import { load } from "cheerio";
import { addDays } from "date-fns";
import { backOff } from "exponential-backoff";

export async function GET(request: Request) {
	const startDate = new Date(new Date().getFullYear(), 0, 1);
	let nextDate = startDate;
	const ids = new Set<string>();
	while (nextDate.getFullYear() === startDate.getFullYear()) {
		const saints = await backOff(() => getSaints(nextDate, "en"));
		const $ = load(saints);
		try {
			$("a").each(function () {
				const pathParts = $(this).attr("href")?.split("/");
				if (pathParts) ids.add(pathParts[pathParts.length - 1]);
			});
		} catch (error) {
			console.log(nextDate);
			console.log(saints);
			throw error;
		} finally {
			await prisma.commemoration.createMany({
				data: [...ids.keys().map(id => ({ id: id }))],
				skipDuplicates: true,
			});
		}
		nextDate = addDays(nextDate, 1);
	}
	const updates = await prisma.commemoration.createMany({
		data: [...ids.keys().map(id => ({ id: id }))],
		skipDuplicates: true,
	});
	return new Response(`Added: ${updates.count}`);
}
