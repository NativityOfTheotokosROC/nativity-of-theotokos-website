import { ModeledVoidComponent } from "@mvc-react/components";
import { WriteQuoteModalModel } from "../../models/write-quote-modal";
import Modal from "../modal/Modal";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import WriteQuote from "../views/write-quote/WriteQuote";
import { X } from "lucide-react";

const WriteQuoteModal = function ({ model }) {
	const t = useTranslations("newQuote");
	const tNonDescriptive = useTranslations("nonDescriptive");
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
				<div className="flex w-full justify-between rounded-none border-0 bg-gray-800 p-6 text-[#FEF8F3]">
					<span className="text-xl">{t("title")}</span>
					<button
						title={tNonDescriptive("close")}
						className={`flex items-center justify-center rounded-lg bg-transparent p-1 text-[28px] transition ease-out hover:text-[#ffdc4f]`}
						onClick={() => {
							interact({ type: "CLOSE" });
						}}
					>
						<X className="size-8" strokeWidth={1.75} />
					</button>
				</div>
				<div className="w-full p-6">
					<WriteQuote
						model={{
							modelView: {
								quote: modelView?.quote,
								autoCompleteInfo: modelView?.autoCompleteInfo,
							},
							async interact(interaction) {
								switch (interaction.type) {
									case "ADD_QUOTE": {
										const { newQuote, id } =
											interaction.input;
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
			</div>
		</Modal>
	);
} satisfies ModeledVoidComponent<WriteQuoteModalModel>;

export default WriteQuoteModal;
