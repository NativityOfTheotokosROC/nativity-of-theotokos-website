"use server";

import { revalidateTag } from "next/cache";
import database from "../third-party/prisma";
import { ScheduleItem, Translation } from "../types/general";
import { getInstantaneousScheduleItemSchema } from "../validation/schedule";
import z from "zod";

type ScheduleItemWithTranslations = Omit<
	{
		[P in keyof ScheduleItem]: ScheduleItem[P] extends string
			? Translation
			: ScheduleItem[P];
	},
	"times"
> & { scheduleItemTimes: { time: Date; desgination: Translation }[] };

type NewInstantaneousScheduleItem = z.infer<
	ReturnType<typeof getInstantaneousScheduleItemSchema>
>;

export async function scheduleInstantaneousItem(
	scheduleItem: NewInstantaneousScheduleItem,
) {
	database;
	revalidateTag("", "max");
}

export async function scheduleRecurringItem() {}
