import z from "zod";
import { getQuoteFormSchema } from "../validation/quote-form";
import { addDays } from "date-fns";
import { Translation } from "../types/general";

export function getDefaultValues() {
	return {
		authorEn: "",
		quoteEn: "",
		isQuoteScheduled: false,
		authorRu: "",
		quoteRu: "",
		sourceEn: "",
		sourceRu: "",
		scheduledDate: addDays(new Date(), 1),
	} satisfies Required<z.infer<ReturnType<typeof getQuoteFormSchema>>>;
}
export type AutoCompleteInfo = {
	existingAuthors: Translation[];
	existingSources: Translation[];
};
