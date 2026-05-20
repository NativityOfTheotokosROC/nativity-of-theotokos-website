"use client";

import { useNewQuote } from "@/src/lib/model-implementations/new-quote";
import NewQuote from "./NewQuote";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { AutoCompleteInfo } from "@/src/lib/utilities/quote-form";

const NewQuoteClient = function ({ model }) {
	const { autoCompleteInfo } = model.modelView;
	const newQuote = useNewQuote(autoCompleteInfo);
	return <NewQuote model={newQuote} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<{ autoCompleteInfo?: AutoCompleteInfo }>
>;

export default NewQuoteClient;
