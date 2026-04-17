import z from "zod";
import { Translator } from "../types/general";
import { useLocalizedSchema } from "./general";
import { getQuoteSchema } from "./quote";

export function getQuoteFormSchema(t?: Translator) {
	const quoteSchema = getQuoteSchema(t);
	return quoteSchema.extend({
		isQuoteScheduled: z.boolean(),
	});
}

export function useQuoteFormSchema() {
	return useLocalizedSchema(getQuoteFormSchema);
}
