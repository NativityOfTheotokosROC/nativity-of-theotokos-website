import { StyledModeledComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { useLocale } from "next-intl";
import { twMerge } from "tailwind-merge";
import { QuoteModel } from "../../models/quote";
import { pickTranslation } from "../../utilities/miscellaneous";
import { CompleteTranslation } from "../../utilities/types";

const QUOTATION_MARKS = {
	openingQuote: { english: "“", russian: "«" } satisfies CompleteTranslation,
	closingQuote: { english: "”", russian: "»" } satisfies CompleteTranslation,
};

const Quote = function ({ model, className, style }) {
	const {
		modelView: { quote, language },
	} = model;
	const locale = useLocale();
	const parsedLanguage = language ?? locale;

	return (
		<div
			className={twMerge(
				`quote-box flex flex-col items-center gap-4 font-light md:w-md`,
				className,
			)}
			style={style}
		>
			<p className="quote text-lg/relaxed">
				<span>
					{pickTranslation(
						QUOTATION_MARKS.openingQuote,
						parsedLanguage,
					)}
				</span>
				{typeof quote.quote === "string"
					? quote.quote
					: pickTranslation(quote.quote, parsedLanguage)}
				<span>
					{pickTranslation(
						QUOTATION_MARKS.closingQuote,
						parsedLanguage,
					)}
				</span>
			</p>
			<span className="author w-full text-right">
				—{" "}
				{typeof quote.author === "string"
					? quote.author
					: pickTranslation(quote.author, parsedLanguage)}
				{quote.source &&
					`, ${typeof quote.source === "string" ? quote.source : pickTranslation(quote.source, parsedLanguage)}`}
			</span>
		</div>
	);
} satisfies StyledModeledComponent<InitializedModel<QuoteModel>>;

export default Quote;
