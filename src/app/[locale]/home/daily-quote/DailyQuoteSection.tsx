import { DailyQuoteSectionModel } from "@/src/lib/model/daily-quote-section";
import { ModeledVoidComponent } from "@mvc-react/components";
import { useTranslations } from "next-intl";

const DailyQuoteSection = function ({ model }) {
	const { dailyQuote } = model.modelView;
	const t = useTranslations("quote");

	return (
		<section className="daily-thought  border-t-15 border-b-15 border-t-gray-900/85 border-b-[#250203]/85">
			<div className="daily-thought-content flex items-center p-8 py-14 md:p-20 min-h-[25em] bg-[#0a0a0a] md:bg-[linear-gradient(to_right,#0a0a0a,transparent),url(/ui/daily-thought.jpg)] text-white bg-no-repeat bg-contain bg-right">
				{dailyQuote && (
					<div
						className={`quote-box flex flex-col gap-4 items-center md:w-1/2`}
					>
						<p className="quote font-light text-lg/relaxed">
							<span>{t("openingQuote")}</span>
							{dailyQuote.quote}
							<span>{t("closingQuote")}</span>
						</p>
						<span className="author font-light w-full text-right">
							— {dailyQuote.author}
							{dailyQuote.source && `, ${dailyQuote.source}`}
						</span>
					</div>
				)}
			</div>
		</section>
	);
} satisfies ModeledVoidComponent<DailyQuoteSectionModel>;

export default DailyQuoteSection;
