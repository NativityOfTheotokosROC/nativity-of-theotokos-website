import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { useTabs } from "../../model-implementations/tabs";
import { ModalModel } from "../../models/modal";
import { QuotePreviewModalModel } from "../../models/quote-preview-modal";
import Modal from "../modal/Modal";
import Tabs from "../tabs/Tabs";

const QuotePreviewModal = function ({ model }) {
	const {
		modelView: { isOpen, englishQuote, russianQuote },
		interact,
	} = model;
	const t = useTranslations("newQuote");
	const tMisc = useTranslations("miscellaneous");

	const modal = {
		modelView: { isOpen, title: t("quotePreview") },
		async interact(interaction) {
			switch (interaction.type) {
				case "TOGGLE": {
					if (interaction.input.value == "open")
						await model.interact({
							type: "OPEN",
							input: { englishQuote, russianQuote },
						});
					await model.interact({ type: "CLOSE" });
				}
			}
		},
	} satisfies ModalModel;
	const authorRu = russianQuote?.author ?? englishQuote.author;
	const quoteRu = russianQuote?.quote ?? englishQuote.quote;
	const sourceRu = russianQuote?.source ?? englishQuote.source;

	const tabs = useTabs(
		[
			newReadonlyModel({ name: t("english") }),
			newReadonlyModel({ name: t("russian") }),
		],
		"center",
	);

	return (
		<Modal model={modal}>
			<div className="flex max-w-full min-w-full flex-col items-center justify-center pt-6 *:px-8 md:max-w-[25em]">
				<Tabs model={tabs}>
					<div
						className={`quote-box flex h-[40dvh] max-h-[40dvh] w-full max-w-full flex-col items-center justify-center-safe gap-4 overflow-y-auto pr-4 data-closed:overflow-hidden [@media(height<=448px)]:max-h-[15dvh]`}
					>
						<p className="quote text-lg/relaxed font-light">
							<span>{"“"}</span>
							{englishQuote.quote}
							<span>{"”"}</span>
						</p>
						<span className="author w-full text-right font-light">
							— {englishQuote.author}
							{englishQuote.source && `, ${englishQuote.source}`}
						</span>
					</div>
					<div
						className={`quote-box flex h-[40dvh] max-h-[40dvh] w-full max-w-full flex-col items-center justify-center-safe gap-4 overflow-y-auto pr-4 data-closed:overflow-hidden [@media(height<=448px)]:max-h-[15dvh]`}
					>
						<p className="quote text-lg/relaxed font-light">
							<span>{"«"}</span>
							{quoteRu}
							<span>{"»"}</span>
						</p>
						<span className="author w-full text-right font-light">
							— {authorRu}
							{sourceRu && `, ${sourceRu}`}
						</span>
					</div>
				</Tabs>
				<div className="mt-3 flex w-full items-center justify-center bg-white p-5">
					<button
						className="w-[8em] rounded-lg bg-[#513433] p-4 text-white hover:bg-[#250203]/90 active:bg-[#250203]"
						onClick={async () => {
							await interact({ type: "CLOSE" });
						}}
					>
						{tMisc("closeButton")}
					</button>
				</div>
			</div>
		</Modal>
	);
} satisfies ModeledVoidComponent<InitializedModel<QuotePreviewModalModel>>;

export default QuotePreviewModal;
