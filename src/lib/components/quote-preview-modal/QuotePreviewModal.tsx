import HymnsOrnament from "@/public/assets/ornament_19.svg";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { useTabs } from "../../model-implementations/tabs";
import { QuotePreviewModalModel } from "../../models/quote-preview-modal";
import Modal from "../modal/Modal";
import Tabs from "../tabs/Tabs";

const QuotePreviewModal = function ({ model }) {
	const { modelView, interact } = model;
	const t = useTranslations("newQuote");
	const tMisc = useTranslations("miscellaneous");
	const authorEn = modelView?.englishQuote.author;
	const quoteEn = modelView?.englishQuote.quote;
	const sourceEn = modelView?.englishQuote.source;
	const authorRu = modelView?.russianQuote?.author ?? authorEn;
	const quoteRu = modelView?.russianQuote?.quote ?? quoteEn;
	const sourceRu = modelView?.russianQuote?.source ?? sourceEn;

	const tabs = useTabs(
		[
			newReadonlyModel({ name: t("english") }),
			newReadonlyModel({ name: t("russian") }),
		],
		"center",
	);

	return (
		<Modal
			model={newReadonlyModel({
				title: t("quotePreview"),
				size: "small",
				isOpen: modelView?.isOpen ?? false,
				async onClose() {
					await interact({ type: "CLOSE" });
				},
			})}
		>
			<div className="flex w-full max-w-full min-w-full flex-col items-center justify-center *:px-8">
				<div className="mb-4 w-full rounded-none border-0 bg-gray-800 p-4 text-[#FEF8F3]">
					<div className="ornament flex h-[4em] w-full items-center justify-center">
						<HymnsOrnament className="h-[4em] w-[8em] fill-[#FEF8F3] object-contain object-center" />
					</div>
				</div>
				<Tabs model={tabs}>
					<div
						className={`quote-box flex h-[35dvh] max-h-[35dvh] max-w-full min-w-full flex-col items-center justify-center-safe gap-4 overflow-y-auto pr-4 data-closed:overflow-hidden`}
					>
						<p className="quote text-lg/relaxed">
							<span>{"“"}</span>
							{quoteEn}
							<span>{"”"}</span>
						</p>
						<span className="author w-full text-right">
							— {authorEn}
							{sourceEn && `, ${sourceEn}`}
						</span>
					</div>
					<div
						className={`quote-box flex h-[35dvh] max-h-[35dvh] max-w-full min-w-full flex-col items-center justify-center-safe gap-4 overflow-y-auto pr-4 data-closed:overflow-hidden`}
					>
						<p className="quote text-lg/relaxed">
							<span>{"«"}</span>
							{quoteRu}
							<span>{"»"}</span>
						</p>
						<span className="author w-full text-right">
							— {authorRu}
							{sourceRu && `, ${sourceRu}`}
						</span>
					</div>
				</Tabs>
				<div className="mt-3 flex w-full items-center justify-center p-5">
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
} satisfies ModeledVoidComponent<QuotePreviewModalModel>;

export default QuotePreviewModal;
