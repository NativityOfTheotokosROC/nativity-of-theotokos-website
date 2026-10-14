import { EditableQuoteModelView } from "@/src/lib/models/editable-quote";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { useLocale } from "next-intl";
import { useState } from "react";
import Quote from "../../quote/Quote";
import { useTranslations } from "next-intl";
import Border from "@/public/assets/border-8.webp";

const QuoteHighlight = function ({ model }) {
	const { quote, modifiers } = model.modelView;
	const locale = useLocale();
	const t = useTranslations("manageQuotes");
	const [language] = useState(locale);

	return (
		<div className="w-full">
			<div
				style={{ backgroundImage: `url(${Border.src})` }}
				className="h-3.75 w-full bg-[#250203] bg-size-[25%] bg-position-[50%_50%] bg-repeat-x md:bg-size-[15%] lg:bg-size-[15%]"
			/>
			<div className="align-center flex w-full flex-col justify-center gap-4 bg-[#0a0a0a] p-8 py-14 text-white md:p-20 min-h-[25em]">
				<span className="self-center font-light uppercase">
					{t("highlightedQuote")}
				</span>
				<Quote
					model={newReadonlyModel({
						quote: { ...quote, author: quote.author.name },
						language,
						variant: "highlight",
						modifiers,
					})}
					className="w-fit max-w-full"
				/>
			</div>
			<div
				style={{ backgroundImage: `url(${Border.src})` }}
				className="h-3.75 w-full bg-[#250203] bg-size-[25%] bg-position-[50%_50%] bg-repeat-x md:bg-size-[15%] lg:bg-size-[15%]"
			/>
		</div>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<Omit<EditableQuoteModelView, "scheduleCallback">>
>;

export default QuoteHighlight;
