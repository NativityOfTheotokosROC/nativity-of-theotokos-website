import z from "zod";
import { Translator } from "../types/general";
import { getRecurringScheduleItemSchema } from "./schedule-item";

export function getRecurringScheduleItemFormSchema(t?: Translator) {
	return getRecurringScheduleItemSchema(t).extend({
		days: z.object({
			sunday: z.boolean,
			monday: z.boolean,
			tuesday: z.boolean,
			wednesday: z.boolean,
			thursday: z.boolean,
			friday: z.boolean,
			saturday: z.boolean,
		}),
	});
}
