import z from "zod";
import { addDays } from "date-fns";
import { Translation } from "./types";
import { getQuoteFormSchema } from "../validation/quote-form";
import { getDateString } from "./date-time";

export function getDefaultValues() {
	return {
		author: { english: "", russian: "" },
		quote: { english: "", russian: "" },
		source: { english: "", russian: "" },
		isQuoteScheduled: false,
		scheduledDate: getDateString(addDays(new Date(), 1), true),
	} satisfies Required<z.infer<ReturnType<typeof getQuoteFormSchema>>>;
}
export type AutoCompleteInfo = {
	existingAuthors: Translation[];
	existingSources: Translation[];
};
