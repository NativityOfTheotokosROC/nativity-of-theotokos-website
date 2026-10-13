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
		<div className="more-quotes-section flex flex-1 flex-col gap-3 border-t-5 border-red-900">
			<span className="uppercase">{t("moreQuotes")}</span>
			<div className="flex w-full flex-col gap-4 md:w-lg">
				<Button
					model={newReadonlyModel({ action: newQuoteCallback })}
					className={"self-end"}
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
