import { EditableQuoteModelView } from "@/src/lib/models/editable-quote";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { useLocale } from "next-intl";
import { useState } from "react";
import Quote from "../../quote/Quote";
import { useTranslations } from "next-intl";

const QuoteHighlight = function ({ model }) {
	const { quote, modifiers } = model.modelView;
	const locale = useLocale();
	const t = useTranslations("manageQuotes");
	const [language] = useState(locale);

	return (
		<div className="flex-col gap-4 align-center flex justify-center bg-[#0a0a0a] p-8 py-14 text-white md:p-20 border-y-15 border-y-[#976029]/82">
			<span className="font-light uppercase underline">
				{t("highlightedQuote")}
			</span>
			<Quote
				model={newReadonlyModel({
					quote: { ...quote, author: quote.author.name },
					language,
					variant: "highlight",
					modifiers,
				})}
			/>
		</div>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<Omit<EditableQuoteModelView, "scheduleCallback">>
>;

export default QuoteHighlight;
