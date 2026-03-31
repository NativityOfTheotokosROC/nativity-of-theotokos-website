import z from "zod";
import { Translator } from "../type/general";
import { useLocalizedSchema } from "./general";
import { getQuoteSchema } from "./quote";

export function getQuoteFormSchema(t?: Translator) {
	const quoteSchema = getQuoteSchema(t);
	return quoteSchema.extend({
		isQuoteScheduled: z.boolean(),
		scheduledDateString: z.iso.date(),
	});
}

export function useQuoteFormSchema() {
	return useLocalizedSchema(getQuoteFormSchema);
}
