import z from "zod";
import { Translator } from "../utilities/types";
import { getTranslationSchema, useLocalizedSchema } from "./utilities";
import { Cron } from "croner";
import { NATIVE_TIMEZONE } from "../utilities/date-time";

export type NewScheduleItem = z.infer<ReturnType<typeof getScheduleItemSchema>>;
export type NewInstantaneousScheduleItem = z.infer<
	ReturnType<typeof getInstantaneousScheduleItemSchema>
>;

export type NewRecurringScheduleItem = z.infer<
	ReturnType<typeof getRecurringScheduleItemSchema>
>;

export function getScheduleItemSchema(t?: Translator) {
	return z.object({
		title: getTranslationSchema(
			t && { t, fieldName: t("scheduleItem.titleField") },
		),
		venue: getTranslationSchema(
			t && { t, fieldName: t("scheduleItem.venueField") },
		),
		times: z
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
					return timesSet.size === scheduleItemTimes.length;
				},
				{ error: t && t("scheduleItem.timeConflict") },
			),
		eventType: z.enum(["normal", "feast", "special"]),
	});
}

export function getInstantaneousScheduleItemSchema(t?: Translator) {
	return getScheduleItemSchema(t).extend({
		date: z.iso.date({
			error:
				t &&
				t("validation.invalidField", {
					field: t("scheduleItem.dateField"),
				}),
		}),
		isRemoved: z.boolean().optional(),
	});
}

export function getRecurringScheduleItemSchema(t?: Translator) {
	return getScheduleItemSchema(t).extend({
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
		isDisabled: z.boolean().optional(),
	});
}

export function useInstantaneousScheduleItemSchema() {
	return useLocalizedSchema(getInstantaneousScheduleItemSchema);
}

export function useRecurringScheduleItemSchema() {
	return useLocalizedSchema(getRecurringScheduleItemSchema);
}

export function validateRecurringPattern(
	pattern: string,
	options?: Partial<{ useLocalTimezone: boolean }>,
) {
	try {
		const cron = new Cron(
			pattern,
			options?.useLocalTimezone
				? { timezone: NATIVE_TIMEZONE }
				: undefined,
		);
		// TODO: This needs work
		if (
			!cron.getPattern()?.startsWith("0 0") ||
			cron.getPattern()?.endsWith("* * *")
		)
			return null;
		return cron;
	} catch {
		return null;
	}
}
