import DailyQuoteGraphic from "@/public/assets/daily-thought.webp";
import { DailyQuoteSectionModel } from "@/src/lib/models/daily-quote-section";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import Quote from "../../../quote/Quote";

const DailyQuoteSection = function ({ model }) {
	const { dailyQuote } = model.modelView;

	if (!dailyQuote) return <></>;

	return (
		<section className="daily-thought border-t-15 border-b-15 border-t-gray-900/85 border-b-[#250203]/85">
			<div
				style={{
					backgroundImage: `linear-gradient(to right,#0a0a0a,transparent),url(${DailyQuoteGraphic.src})`,
				}}
				className="daily-thought-content flex min-h-[25em] items-center bg-[#0a0a0a] bg-contain bg-right bg-no-repeat p-8 py-14 text-white max-md:bg-none! md:p-20"
			>
				<Quote
					model={newReadonlyModel({
						quote: {
							...dailyQuote,
							source: dailyQuote.source ?? undefined,
						},
					})}
					className="md:w-1/2"
				/>
			</div>
		</section>
	);
} satisfies ModeledVoidComponent<DailyQuoteSectionModel>;

export default DailyQuoteSection;
