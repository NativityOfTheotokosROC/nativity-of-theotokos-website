import { EditableQuoteModelView } from "@/src/lib/models/editable-quote";
import { QuoteModelView } from "@/src/lib/models/quote";
import { DetailedQuote } from "@/src/lib/utilities/quote";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import Button from "../../button/Button";
import QuotesWidget from "../../quotes-widget/QuotesWidget";
import { Translation } from "@/src/lib/utilities/types";

const MoreQuotes = function ({ model }) {
	const { quotes, newQuoteCallback, quoteModifiers } = model.modelView;
	const t = useTranslations("manageQuotes");
	// const tabs = useTabs({
	// 	tabs: [
	// 		newReadonlyModel({ name: t("allQuotes") }),
	// 		newReadonlyModel({ name: t("byAuthor") }),
	// 	],
	// });

	return (
		<div className="more-quotes-section flex flex-col gap-5 p-8 py-9 md:py-10 lg:px-20">
			<span className="text-xl">{t("moreQuotes")}</span>
			<div className="flex w-full flex-col gap-5 md:w-lg">
				<Button
					model={newReadonlyModel({ action: newQuoteCallback })}
					className="w-full"
				>
					{t("newQuote")}
				</Button>
				<QuotesWidget
					model={newReadonlyModel({
						quotes,
						modifiers: quoteModifiers,
					})}
				/>
			</div>
		</div>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<
		Omit<EditableQuoteModelView, "quote"> & {
			quotes: DetailedQuote<Translation>[];
			newQuoteCallback: () => void;
			quoteModifiers: QuoteModelView["modifiers"];
		}
	>
>;

export default MoreQuotes;
