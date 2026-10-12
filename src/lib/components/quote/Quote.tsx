import { StyledModeledComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useLocale } from "next-intl";
import { twMerge } from "tailwind-merge";
import { QuoteModel } from "../../models/quote";
import { pickTranslation } from "../../utilities/miscellaneous";
import { CompleteTranslation } from "../../utilities/types";
import EditQuotePanel from "./EditQuotePanel";

const QUOTATION_MARKS = {
	openingQuote: { english: "“", russian: "«" } satisfies CompleteTranslation,
	closingQuote: { english: "”", russian: "»" } satisfies CompleteTranslation,
};

const Quote = function ({ model, className, style }) {
	const {
		modelView: { quote, language, variant, modifiers },
	} = model;
	const locale = useLocale();
	const parsedLanguage = language ?? locale;

	return (
		<div
			className={twMerge(
				`quote-box flex flex-col gap-4 md:w-md`,
				variant === "highlight"
					? "items-center gap-4"
					: variant === "miniaturized"
						? "gap-2"
						: undefined,
				className,
			)}
			style={style}
		>
			<p
				className={`quote ${variant === "highlight" ? "text-lg/relaxed" : variant === "miniaturized" ? "text-sm/relaxed" : ""}`}
			>
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
			{quote.id !== undefined && modifiers && (
				<EditQuotePanel
					model={newReadonlyModel({ quote, modifiers })}
				/>
			)}
		</div>
	);
} satisfies StyledModeledComponent<InitializedModel<QuoteModel>>;

export default Quote;
