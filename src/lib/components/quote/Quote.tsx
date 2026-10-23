import {
	ModeledVoidComponent,
	StyledModeledComponent,
} from "@mvc-react/components";
import {
	InitializedModel,
	newReadonlyModel,
	ReadonlyModel,
} from "@mvc-react/mvc";
import { useLocale } from "next-intl";
import { twMerge } from "tailwind-merge";
import { QuoteModel } from "../../models/quote";
import { pickTranslation } from "../../utilities/miscellaneous";
import { CompleteTranslation, Language, Text } from "../../utilities/types";
import EditQuotePanel from "./EditQuotePanel";
import QuoteIcon from "@/public/assets/quote.svg";

const QUOTATION_MARKS = {
	openingQuote: { english: "“", russian: "«" } satisfies CompleteTranslation,
	closingQuote: { english: "”", russian: "»" } satisfies CompleteTranslation,
};

const Quote = function ({ model, className, style }) {
	const {
		modelView: {
			quote,
			language,
			variant,
			quoteStyle = "giant_mark",
			modifiers,
		},
	} = model;
	const locale = useLocale();
	const parsedLanguage = language ?? locale;

	return (
		<div
			className={twMerge(
				`quote-box flex flex-col gap-4`,
				variant === "highlight"
					? "items-center gap-4 md:w-md"
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
				{quoteStyle === "quotation_marks" && (
					<QuotationMarked
						model={newReadonlyModel({
							quote: quote.quote,
							language: parsedLanguage,
						})}
					/>
				)}
				{quoteStyle === "giant_mark" && (
					<span
						className={`inline-flex gap-2 ${variant === "highlight" ? "flex-col items-baseline gap-3 md:flex-row" : ""}`}
					>
						{variant === "highlight" ? (
							<QuoteIcon className="h-6 min-w-5 fill-current opacity-50" />
						) : (
							<span className={`text-4xl opacity-50`}>
								{QUOTATION_MARKS.openingQuote.english}
							</span>
						)}
						<span
							className={`${variant === "highlight" ? "pl-2 md:p-0" : ""}`}
						>
							{typeof quote.quote === "string"
								? quote.quote
								: pickTranslation(quote.quote, parsedLanguage)}
						</span>
					</span>
				)}
			</p>
			<span
				className={`author w-full text-right ${variant === "miniaturized" ? "text-sm" : ""}`}
			>
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
					className="self-end"
				/>
			)}
		</div>
	);
} satisfies StyledModeledComponent<InitializedModel<QuoteModel>>;

const QuotationMarked = function ({ model }) {
	const { quote, language } = model.modelView;

	return (
		<>
			<span>
				{pickTranslation(QUOTATION_MARKS.openingQuote, language)}
			</span>
			{typeof quote === "string"
				? quote
				: pickTranslation(quote, language)}
			<span>
				{pickTranslation(QUOTATION_MARKS.closingQuote, language)}
			</span>
		</>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{ quote: Text; language: Language }>
>;

export default Quote;
