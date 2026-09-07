import z from "zod";
import { Translator } from "../types/general";
import { getTranslationSchema } from "./general";
import { validateRecurringPattern } from "../utilities/schedule";

export type NewInstantaneousScheduleItem = z.infer<
	ReturnType<typeof getInstantaneousScheduleItemSchema>
>;

export type NewRecurringScheduleItem = z.infer<
	ReturnType<typeof getRecurringScheduleItemSchema>
>;

function getSharedSchema(t?: Translator) {
	return z.object({
		title: getTranslationSchema(
			t && { t, fieldName: t("scheduleItem.titleField") },
		),
		venue: getTranslationSchema(
			t && { t, fieldName: t("scheduleItem.venueField") },
		),
		scheduleItemTimes: z
			.array(
				z.object({
					time: z.iso.time({
						precision: -1,
						error:
							t &&
							t("validation.invalidField", {
								field: t("scheduleItem.timeField"),
							}),
					}),
					designation: getTranslationSchema(
						t && {
							t,
							fieldName: t("scheduleItem.designationField"),
						},
					),
				}),
			)
			.nonempty({ error: t && t("scheduleItem.emptyTimes") })
			.refine(
				scheduleItemTimes => {
					const timesSet = new Set();
					scheduleItemTimes.forEach(scheduleItemTime =>
						timesSet.add(scheduleItemTime.time),
					);
					return timesSet.size === 1;
				},
				{ error: t && t("scheduleItem.timeConflict") },
			),
	});
}

export function getInstantaneousScheduleItemSchema(t?: Translator) {
	return getSharedSchema(t).extend({
		date: z.iso.date({
			error:
				t &&
				t("validation.invalidField", {
					field: t("scheduleItem.dateField"),
				}),
		}),
	});
}

export function getRecurringScheduleItemSchema(t?: Translator) {
	return getSharedSchema(t).extend({
		recurringPattern: z
			.string()
			.nonempty({
				error:
					t &&
					t("validation.nonEmpty", {
						field: t("scheduleItem.recurringPatternField"),
					}),
			})
			.refine(pattern => validateRecurringPattern(pattern), {
				error:
					t &&
					t("validation.invalidField", {
						field: t("scheduleItem.recurringPatternField"),
					}),
			}),
	});
}
