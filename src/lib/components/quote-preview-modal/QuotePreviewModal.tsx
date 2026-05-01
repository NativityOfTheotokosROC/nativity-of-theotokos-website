import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { QuotePreviewModalModel } from "../../models/quote-preview-modal";
import Modal from "../modal/Modal";
import { useTranslations } from "next-intl";
import { ModalModel } from "../../models/modal";
import Tabs from "../tabs/Tabs";
import { useTabs } from "../../model-implementations/tabs";

const QuotePreviewModal = function ({ model }) {
	const {
		modelView: { isOpen, englishQuote, russianQuote },
	} = model;
	const t = useTranslations("newQuote");
    const tQuote = useTranslations("quote")
	const modal = {
		modelView: { isOpen, title: t("quotePreview") },
		async interact(interaction) {
			switch (interaction.type) {
				case "TOGGLE": {
					await model.interact({
						type: "TOGGLE",
						input: { value: interaction.input.value },
					});
				}
			}
		},
	} satisfies ModalModel;
    const authorRu = russianQuote.author ?? englishQuote.author
    const quoteRu = russianQuote.quote ?? englishQuote.quote
    const sourceRu = russianQuote.source ?? englishQuote.source

    const tabs = useTabs([newReadonlyModel({name: t("english")}), newReadonlyModel({name: t("russian")})])

	return (
		<Modal model={modal}>
			<Tabs model={tabs}>
                <div
						className={`quote-box flex flex-col items-center gap-4 md:w-1/2`}
					>
						<p className="quote text-lg/relaxed font-light">
							<span>{tQuote("openingQuote")}</span>
							{englishQuote.quote}
							<span>{tQuote("closingQuote")}</span>
						</p>
						<span className="author w-full text-right font-light">
							— {englishQuote.author}
							{englishQuote.source && `, ${englishQuote.source}`}
						</span>
					</div>
                    <div
						className={`quote-box flex flex-col items-center gap-4 md:w-1/2`}
					>
						<p className="quote text-lg/relaxed font-light">
							<span>{tQuote("openingQuote")}</span>
							{quoteRu}
							<span>{tQuote("closingQuote")}</span>
						</p>
						<span className="author w-full text-right font-light">
							— {authorRu}
							{sourceRu && `, ${sourceRu}`}
						</span>
					</div>
            </Tabs>
		</Modal>
	);
} satisfies ModeledVoidComponent<InitializedModel<QuotePreviewModalModel>>;

export default QuotePreviewModal;
