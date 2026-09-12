import z from "@/node_modules/zod/v4/classic/external.cjs";
import { Translator } from "../utilities/types";
import {
	getRecurringScheduleItemSchema,
	getScheduleItemSchema,
} from "./schedule-item";

export function getScheduleItemFormSchema(t?: Translator) {}
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
