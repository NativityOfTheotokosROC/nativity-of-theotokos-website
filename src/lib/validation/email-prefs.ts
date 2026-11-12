import z from "zod";
import { Translator } from "../utilities/types";

export type NewEmailPrefs = z.infer<ReturnType<typeof getEmailPrefsSchema>>;

const namesSchema = z.nullable(
	z.preprocess(
		value =>
			typeof value === "string"
				? value.trim().length === 0
					? null
					: value
				: value,
		z.string().trim().nullable(),
	),
);

export function getEmailPrefsSchema(t?: Translator) {
	return z.object({
		firstName: namesSchema.optional(),
		lastName: namesSchema.optional(),
		isUnsubscribed: z.boolean().optional(),
		preferredLang: z.enum(["en", "ru"]).optional(),
	});
}
