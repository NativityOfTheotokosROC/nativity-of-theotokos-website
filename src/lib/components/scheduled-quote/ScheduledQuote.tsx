import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useLocale } from "next-intl";
import { ScheduledQuoteModel } from "../../models/scheduled-quote";
import {
	ENGLISH_DATE_LOCALE,
	RUSSIAN_DATE_LOCALE,
} from "../../utilities/date-time";
import EditQuotePanel from "../quote/EditQuotePanel";
import Quote from "../quote/Quote";

const ScheduledQuote = function ({ model }) {
	const { quote, modifiers } = model.modelView;
	const locale = useLocale();
	const dateLocale =
		locale === "ru" ? RUSSIAN_DATE_LOCALE : ENGLISH_DATE_LOCALE;

	return (
		<div className="flex flex-col gap-2">
			<Quote
				model={newReadonlyModel({
					quote: { ...quote, author: quote.author.name },
					variant: "miniaturized",
				})}
			/>
			<span className="underline">
				{quote.date.toLocaleDateString(dateLocale, {
					dateStyle: "medium",
				})}
			</span>
			{modifiers && (
				<EditQuotePanel
					model={newReadonlyModel({
						quote: { ...quote, author: quote.author.name },
						modifiers,
					})}
					className="self-end"
				/>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<ScheduledQuoteModel>>;

export default ScheduledQuote;
