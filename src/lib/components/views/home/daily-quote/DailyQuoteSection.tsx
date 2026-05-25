import DailyQuoteGraphic from "@/public/assets/daily-thought.jpg";
import { DailyQuoteSectionModel } from "@/src/lib/models/daily-quote-section";
import { ModeledVoidComponent } from "@mvc-react/components";
import { useTranslations } from "next-intl";

const DailyQuoteSection = function ({ model }) {
	const { dailyQuote } = model.modelView;
	const t = useTranslations("quote");

	return (
		<section className="daily-thought border-t-15 border-b-15 border-t-gray-900/85 border-b-[#250203]/85">
			<div
				style={{
					backgroundImage: `linear-gradient(to right,#0a0a0a,transparent),url(${DailyQuoteGraphic.src})`,
				}}
				className="daily-thought-content flex min-h-[25em] items-center bg-[#0a0a0a] bg-contain bg-right bg-no-repeat p-8 py-14 text-white max-md:bg-none! md:p-20"
			>
				{dailyQuote && (
					<div
						className={`quote-box flex flex-col items-center gap-4 md:w-1/2`}
					>
						<p className="quote text-lg/relaxed font-light">
							<span>{t("openingQuote")}</span>
							{dailyQuote.quote}
							<span>{t("closingQuote")}</span>
						</p>
						<span className="author w-full text-right font-light">
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
