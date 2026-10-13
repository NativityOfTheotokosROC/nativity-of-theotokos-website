import { ModeledVoidComponent } from "@mvc-react/components";
import { WriteQuoteModalModel } from "../../models/write-quote-modal";
import Modal from "../modal/Modal";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import WriteQuote from "../views/write-quote/WriteQuote";

const WriteQuoteModal = function ({ model }) {
	const t = useTranslations("newQuote");
	const { modelView, interact } = model;

	return (
		<Modal
			model={newReadonlyModel({
				isOpen: modelView?.isOpen ?? false,
				onClose: () => interact({ type: "CLOSE" }),
				size: "small",
				title: t("title"),
			})}
		>
			<div className="flex w-full flex-col items-center justify-center">
				<div className="w-full rounded-none border-0 bg-gray-800 p-6 text-[#FEF8F3]">
					<span className="text-xl">{t("title")}</span>
				</div>
				<WriteQuote
					model={{
						modelView: {
							quote: modelView?.quote,
							autoCompleteInfo: modelView?.autoCompleteInfo,
						},
						async interact(interaction) {
							switch (interaction.type) {
								case "ADD_QUOTE": {
									const { newQuote, id } = interaction.input;
									await interact({
										type: "ADD_QUOTE",
										input: {
											newQuote,
											id,
										},
									});
									await interact({ type: "CLOSE" });
								}
							}
						},
					}}
				/>
			</div>
		</Modal>
	);
} satisfies ModeledVoidComponent<WriteQuoteModalModel>;

export default WriteQuoteModal;
